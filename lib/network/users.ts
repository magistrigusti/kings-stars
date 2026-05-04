import { getNetworkDb } from './mongodb';

const COLLECTION_NAME = 'kingstars_users';

export interface NetworkUserInput {
  clerkUserId?: string | null;
  portalUserId?: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string | null;
  provider?: string;
}

export async function upsertNetworkUser(input: NetworkUserInput) {
  const db = await getNetworkDb();
  const now = new Date();

  await db.collection(COLLECTION_NAME).updateOne(
    input.portalUserId
      ? { portalUserId: input.portalUserId }
      : { clerkUserId: input.clerkUserId },
    {
      $set: {
        ...input,
        provider: input.provider ?? 'clerk_google',
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  return db.collection(COLLECTION_NAME).findOne(
    input.portalUserId
      ? { portalUserId: input.portalUserId }
      : { clerkUserId: input.clerkUserId },
    {
      projection: {
        _id: 0,
        portalUserId: 1,
        clerkUserId: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        fullName: 1,
        imageUrl: 1,
        provider: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  );
}
