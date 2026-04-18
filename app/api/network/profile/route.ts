import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { upsertNetworkUser } from '@/lib/network/users';

export const runtime = 'nodejs';

export async function GET() {
  const user = await currentUser();

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
