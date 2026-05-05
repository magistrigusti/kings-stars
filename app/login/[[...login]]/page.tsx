import { redirect } from 'next/navigation';
import { getPortalLoginUrl } from '@/lib/network/portalAuthUrl';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  redirect(getPortalLoginUrl());
}
