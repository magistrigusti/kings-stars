import { getNetworkDb } from './mongodb';
import {
  EMPTY_NETWORK_PROGRESS,
  type NetworkTrainingProgress,
  sanitizeTrainingProgress,
} from './trainingProgress';

const COLLECTION_NAME = 'kingstars_training_progress';

export async function getStoredTrainingProgress(networkUserId: string): Promise<NetworkTrainingProgress> {
  const db = await getNetworkDb();
  const record = await db.collection(COLLECTION_NAME).findOne(
    { networkUserId },
    { projection: { _id: 0, progress: 1 } },
  );

  return sanitizeTrainingProgress(record?.progress ?? EMPTY_NETWORK_PROGRESS);
}

export async function saveStoredTrainingProgress(
  networkUserId: string,
  progress: NetworkTrainingProgress,
): Promise<NetworkTrainingProgress> {
  const cleanProgress = sanitizeTrainingProgress(progress);
  const db = await getNetworkDb();
  const now = new Date();

  await db.collection(COLLECTION_NAME).updateOne(
    { networkUserId },
    {
      $set: {
        networkUserId,
        progress: cleanProgress,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  return cleanProgress;
}
