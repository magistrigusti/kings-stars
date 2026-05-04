import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getKingStarsPortalSession } from '@/lib/network/portalSession';
import {
  getStoredTrainingProgress,
  saveStoredTrainingProgress,
} from '@/lib/network/trainingProgressStore';
import { sanitizeTrainingProgress } from '@/lib/network/trainingProgress';

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = await auth();
  const portalUser = await getKingStarsPortalSession();
  const networkUserId = portalUser?.userId ?? userId;

  if (!networkUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const progress = await getStoredTrainingProgress(networkUserId);

  return NextResponse.json({ progress });
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  const portalUser = await getKingStarsPortalSession();
  const networkUserId = portalUser?.userId ?? userId;

  if (!networkUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const progress = sanitizeTrainingProgress(body?.progress ?? body);
  const savedProgress = await saveStoredTrainingProgress(networkUserId, progress);

  return NextResponse.json({ progress: savedProgress });
}
