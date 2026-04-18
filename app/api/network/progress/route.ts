import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  getStoredTrainingProgress,
  saveStoredTrainingProgress,
} from '@/lib/network/trainingProgressStore';
import { sanitizeTrainingProgress } from '@/lib/network/trainingProgress';

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const progress = await getStoredTrainingProgress(userId);

  return NextResponse.json({ progress });
}

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const progress = sanitizeTrainingProgress(body?.progress ?? body);
  const savedProgress = await saveStoredTrainingProgress(userId, progress);

  return NextResponse.json({ progress: savedProgress });
}
