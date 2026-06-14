import crypto, { type JsonWebKey } from 'crypto';

const TELEGRAM_AUTH_URL = 'https://oauth.telegram.org/auth';
const TELEGRAM_TOKEN_URL = 'https://oauth.telegram.org/token';
const TELEGRAM_JWKS_URL = 'https://oauth.telegram.org/.well-known/jwks.json';
const TELEGRAM_ISSUER = 'https://oauth.telegram.org';

export interface TelegramOidcSession {
  state: string;
  nonce: string;
  codeVerifier: string;
  authorizationUrl: string;
}

export interface TelegramOidcUser {
  id: string;
  name: string;
  username: string | null;
  picture: string | null;
  phoneNumber: string | null;
}

interface TelegramTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  id_token?: string;
  error?: string;
  error_description?: string;
}

interface TelegramJwtHeader {
  alg?: string;
  kid?: string;
}

interface TelegramJwtClaims {
  iss?: string;
  aud?: string | number;
  sub?: string;
  exp?: number;
  iat?: number;
  nonce?: string;
  id?: string | number;
  name?: string;
  preferred_username?: string;
  picture?: string;
  phone_number?: string;
}

interface TelegramJwk extends JsonWebKey {
  alg?: string;
  kid?: string;
  kty: string;
  crv?: string;
  e?: string;
  n?: string;
  x?: string;
  y?: string;
}

interface TelegramJwksResponse {
  keys: TelegramJwk[];
}

function getTelegramClientId(): string {
  const clientId = process.env.TELEGRAM_CLIENT_ID;

  if (!clientId) {
    throw new Error('TELEGRAM_CLIENT_ID is not configured');
  }

  return clientId;
}

function getTelegramClientSecret(): string {
  const clientSecret = process.env.TELEGRAM_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error('TELEGRAM_CLIENT_SECRET is not configured');
  }

  return clientSecret;
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64url');
}

function base64UrlDecodeJson<T>(value: string): T {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
}

function createRandomToken(): string {
  return base64UrlEncode(crypto.randomBytes(32));
}

function createCodeChallenge(codeVerifier: string): string {
  return base64UrlEncode(
    crypto.createHash('sha256').update(codeVerifier).digest(),
  );
}

export function createTelegramOidcSession(origin: string): TelegramOidcSession {
  const clientId = getTelegramClientId();
  const state = createRandomToken();
  const nonce = createRandomToken();
  const codeVerifier = createRandomToken();
  const redirectUri = new URL('/api/auth/telegram/callback', origin).toString();
  const authorizationUrl = new URL(TELEGRAM_AUTH_URL);

  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid profile phone');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('nonce', nonce);
  authorizationUrl.searchParams.set('code_challenge', createCodeChallenge(codeVerifier));
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');

  return {
    state,
    nonce,
    codeVerifier,
    authorizationUrl: authorizationUrl.toString(),
  };
}

async function exchangeTelegramCode(input: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<string> {
  const clientId = getTelegramClientId();
  const clientSecret = getTelegramClientSecret();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: input.code,
    redirect_uri: input.redirectUri,
    client_id: clientId,
    code_verifier: input.codeVerifier,
  });
  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(TELEGRAM_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = (await response.json()) as TelegramTokenResponse;

  if (!response.ok || !data.id_token) {
    throw new Error(data.error_description || data.error || 'Telegram token exchange failed');
  }

  return data.id_token;
}

async function getTelegramJwks(): Promise<TelegramJwksResponse> {
  const response = await fetch(TELEGRAM_JWKS_URL, {
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error('Telegram JWKS request failed');
  }

  return response.json() as Promise<TelegramJwksResponse>;
}

function getJwtParts(idToken: string): {
  header: TelegramJwtHeader;
  claims: TelegramJwtClaims;
  signingInput: Buffer;
  signature: Buffer;
} {
  const [encodedHeader, encodedClaims, encodedSignature] = idToken.split('.');

  if (!encodedHeader || !encodedClaims || !encodedSignature) {
    throw new Error('Telegram id_token has invalid JWT format');
  }

  return {
    header: base64UrlDecodeJson<TelegramJwtHeader>(encodedHeader),
    claims: base64UrlDecodeJson<TelegramJwtClaims>(encodedClaims),
    signingInput: Buffer.from(`${encodedHeader}.${encodedClaims}`),
    signature: Buffer.from(encodedSignature, 'base64url'),
  };
}

function addDerInteger(bytes: Buffer): Buffer {
  let cleanBytes = bytes;

  while (cleanBytes.length > 1 && cleanBytes[0] === 0 && cleanBytes[1] < 0x80) {
    cleanBytes = cleanBytes.subarray(1);
  }

  if (cleanBytes[0] >= 0x80) {
    cleanBytes = Buffer.concat([Buffer.from([0]), cleanBytes]);
  }

  return Buffer.concat([
    Buffer.from([0x02, cleanBytes.length]),
    cleanBytes,
  ]);
}

function joseEcdsaSignatureToDer(signature: Buffer): Buffer {
  const signaturePartLength = signature.length / 2;
  const r = addDerInteger(signature.subarray(0, signaturePartLength));
  const s = addDerInteger(signature.subarray(signaturePartLength));
  const sequenceLength = r.length + s.length;

  return Buffer.concat([
    Buffer.from([0x30, sequenceLength]),
    r,
    s,
  ]);
}

function verifyTelegramSignature(input: {
  header: TelegramJwtHeader;
  jwk: TelegramJwk;
  signingInput: Buffer;
  signature: Buffer;
}): boolean {
  const publicKey = crypto.createPublicKey({
    key: input.jwk,
    format: 'jwk',
  });

  if (input.header.alg === 'RS256') {
    return crypto.verify(
      'RSA-SHA256',
      input.signingInput,
      publicKey,
      input.signature,
    );
  }

  if (input.header.alg === 'ES256' || input.header.alg === 'ES256K') {
    return crypto.verify(
      'SHA256',
      input.signingInput,
      publicKey,
      joseEcdsaSignatureToDer(input.signature),
    );
  }

  if (input.header.alg === 'EdDSA') {
    return crypto.verify(
      null,
      input.signingInput,
      publicKey,
      input.signature,
    );
  }

  return false;
}

async function verifyTelegramIdToken(input: {
  idToken: string;
  nonce: string;
}): Promise<TelegramJwtClaims> {
  const clientId = getTelegramClientId();
  const jwt = getJwtParts(input.idToken);
  const jwks = await getTelegramJwks();
  const jwk = jwks.keys.find((key) => (
    key.kid === jwt.header.kid
    && key.alg === jwt.header.alg
  ));

  if (!jwk) {
    throw new Error('Telegram id_token signing key not found');
  }

  if (!verifyTelegramSignature({
    header: jwt.header,
    jwk,
    signingInput: jwt.signingInput,
    signature: jwt.signature,
  })) {
    throw new Error('Telegram id_token signature is invalid');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);

  if (jwt.claims.iss !== TELEGRAM_ISSUER) {
    throw new Error('Telegram id_token issuer is invalid');
  }

  if (String(jwt.claims.aud) !== clientId) {
    throw new Error('Telegram id_token audience is invalid');
  }

  if (!jwt.claims.exp || jwt.claims.exp < nowSeconds) {
    throw new Error('Telegram id_token is expired');
  }

  if (jwt.claims.nonce !== input.nonce) {
    throw new Error('Telegram id_token nonce is invalid');
  }

  return jwt.claims;
}

export async function completeTelegramOidcLogin(input: {
  code: string;
  nonce: string;
  codeVerifier: string;
  origin: string;
}): Promise<TelegramOidcUser> {
  const redirectUri = new URL('/api/auth/telegram/callback', input.origin).toString();
  const idToken = await exchangeTelegramCode({
    code: input.code,
    codeVerifier: input.codeVerifier,
    redirectUri,
  });
  const claims = await verifyTelegramIdToken({
    idToken,
    nonce: input.nonce,
  });
  const id = String(claims.id ?? claims.sub ?? '');
  const name = claims.name || claims.preferred_username || `Telegram ${id}`;

  if (!id) {
    throw new Error('Telegram id_token does not contain user id');
  }

  return {
    id,
    name,
    username: claims.preferred_username ?? null,
    picture: claims.picture ?? null,
    phoneNumber: claims.phone_number ?? null,
  };
}
