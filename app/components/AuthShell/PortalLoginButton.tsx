import s from './AuthShell.module.scss';

function getPortalLoginUrl() {
  const portalUrl =
    process.env.NEXT_PUBLIC_PORTAL_AUTH_URL ||
    'https://portal-network.vercel.app/api/auth/portal-sso/start';
  const appUrl =
    process.env.NEXT_PUBLIC_KINGSTARS_URL ||
    'https://land-of-smiles.vercel.app';
  const url = new URL(portalUrl);

  url.searchParams.set('return_to', `${appUrl}/api/auth/portal/callback`);

  return url.toString();
}

export default function PortalLoginButton() {
  return (
    <a href={getPortalLoginUrl()} className={s.portalLogin}>
      Войти через портал
    </a>
  );
}
