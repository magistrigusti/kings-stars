import { getNetworkDb } from './mongodb';
import {
  EMPTY_NETWORK_PROGRESS,
  mergeTrainingProgress,
  type NetworkTrainingProgress,
  sanitizeTrainingProgress,
} from './trainingProgress';

const COLLECTION_NAME = 'kingstars_training_progress';

function getProgressLookupIds(
  networkUserId: string,
  legacyNetworkUserIds: string[] = [],
): string[] {
  return Array.from(
    new Set(
      [networkUserId, ...legacyNetworkUserIds]
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export async function getStoredTrainingProgress(
  networkUserId: string,
  legacyNetworkUserIds: string[] = [],
): Promise<NetworkTrainingProgress> {
  const db = await getNetworkDb();
  const lookupIds = getProgressLookupIds(networkUserId, legacyNetworkUserIds);
  const records = await db.collection(COLLECTION_NAME).find(
    {
      networkUserId: {
        $in: lookupIds,
      },
    },
    { projection: { _id: 0, progress: 1 } },
  ).toArray();

  return records.reduce(
    (mergedProgress, record) =>
      mergeTrainingProgress(
        mergedProgress,
        sanitizeTrainingProgress(record.progress ?? EMPTY_NETWORK_PROGRESS),
      ),
    EMPTY_NETWORK_PROGRESS,
  );
}

export async function saveStoredTrainingProgress(
  networkUserId: string,
  progress: NetworkTrainingProgress,
  legacyNetworkUserIds: string[] = [],
): Promise<NetworkTrainingProgress> {
  const db = await getNetworkDb();
  const now = new Date();
  const existingProgress = await getStoredTrainingProgress(
    networkUserId,
    legacyNetworkUserIds,
  );
  const cleanProgress = mergeTrainingProgress(
    existingProgress,
    sanitizeTrainingProgress(progress),
  );

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
