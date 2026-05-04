import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getKingStarsPortalSession } from '@/lib/network/portalSession';
import { upsertNetworkUser } from '@/lib/network/users';

export const runtime = 'nodejs';

export async function GET() {
  const user = await currentUser();
  const portalUser = await getKingStarsPortalSession();

  if (!user && !portalUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (portalUser) {
    const profile = await upsertNetworkUser({
      portalUserId: portalUser.userId,
      clerkUserId: null,
      email: portalUser.emailAddress,
      firstName: portalUser.name.split(' ')[0] ?? portalUser.name,
      lastName: portalUser.name.split(' ').slice(1).join(' ') || null,
      fullName: portalUser.name,
      imageUrl: portalUser.imageUrl,
      provider: portalUser.authProvider === 'telegram' ? 'portal_telegram' : 'portal_clerk',
    });

    return NextResponse.json({ profile });
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || null;

  const profile = await upsertNetworkUser({
    clerkUserId: user.id,
    email: primaryEmail,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName,
    imageUrl: user.imageUrl,
  });

  return NextResponse.json({ profile });
}
