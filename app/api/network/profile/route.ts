import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getKingStarsPortalSession } from '@/lib/network/portalSession';
import { syncKingStarsNetworkUser } from '@/lib/network/users';

export const runtime = 'nodejs';

export async function GET() {
  const user = await currentUser();
  const portalUser = await getKingStarsPortalSession();
  const profile = await syncKingStarsNetworkUser({
    clerkUser: user,
    portalUser,
  });

  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ profile });
}
