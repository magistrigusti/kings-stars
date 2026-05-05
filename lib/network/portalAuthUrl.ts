const DEFAULT_PORTAL_AUTH_URL = 'https://portal-network.vercel.app/api/auth/portal-sso/start';
const DEFAULT_KINGSTARS_URL = 'https://land-of-smiles.vercel.app';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getPortalLoginUrl(): string {
  const portalUrl =
    process.env.NEXT_PUBLIC_PORTAL_AUTH_URL ||
    process.env.PORTAL_AUTH_URL ||
    DEFAULT_PORTAL_AUTH_URL;
  const appUrl = trimTrailingSlash(
    process.env.NEXT_PUBLIC_KINGSTARS_URL ||
      process.env.KINGSTARS_URL ||
      DEFAULT_KINGSTARS_URL,
  );
  const url = new URL(portalUrl);

  url.searchParams.set('return_to', `${appUrl}/api/auth/portal/callback`);

  return url.toString();
}
