import type { ObjectId, WithId } from 'mongodb';
import { getNetworkDb } from './mongodb';

export type PortalAnimaRole = 'user' | 'assistant';

export interface PortalAnimaMessage {
  id: string;
  role: PortalAnimaRole;
  content: string;
  createdAt: string;
}

export interface PortalAnimaModelMessage {
  role: PortalAnimaRole;
  content: string;
}

interface StoredPortalAnimaMessage {
  _id?: ObjectId;
  ownerId: string;
  role: PortalAnimaRole;
  content: string;
  createdAt: Date;
}

const COLLECTION_NAME = 'kingstars_anima_messages';
const MAX_STORED_MESSAGES = 80;
const DEFAULT_HISTORY_LIMIT = 24;

function serializeMessage(
  message: WithId<StoredPortalAnimaMessage>,
): PortalAnimaMessage {
  return {
    id: message._id.toString(),
    role: message.role,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  };
}

async function getAnimaCollection() {
  const db = await getNetworkDb();

  return db.collection<StoredPortalAnimaMessage>(COLLECTION_NAME);
}

export async function getPortalAnimaHistory(
  ownerId: string,
  limit = DEFAULT_HISTORY_LIMIT,
): Promise<PortalAnimaMessage[]> {
  const collection = await getAnimaCollection();
  const safeLimit = Math.max(1, Math.min(60, limit));
  const messages = await collection
    .find({ ownerId })
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .toArray();

  return messages.reverse().map(serializeMessage);
}

export async function getPortalAnimaModelHistory(
  ownerId: string,
  limit = 10,
): Promise<PortalAnimaModelMessage[]> {
  const history = await getPortalAnimaHistory(ownerId, limit);

  return history.map(message => ({
    role: message.role,
    content: message.content,
  }));
}

export async function appendPortalAnimaMessage(
  ownerId: string,
  role: PortalAnimaRole,
  content: string,
): Promise<PortalAnimaMessage> {
  const collection = await getAnimaCollection();
  const createdAt = new Date();
  const insertResult = await collection.insertOne({
    ownerId,
    role,
    content,
    createdAt,
  });

  await trimPortalAnimaHistory(ownerId);

  return {
    id: insertResult.insertedId.toString(),
    role,
    content,
    createdAt: createdAt.toISOString(),
  };
}

export async function clearPortalAnimaHistory(ownerId: string): Promise<void> {
  const collection = await getAnimaCollection();

  await collection.deleteMany({ ownerId });
}

async function trimPortalAnimaHistory(ownerId: string) {
  const collection = await getAnimaCollection();
  const olderMessages = await collection
    .find({ ownerId }, { projection: { _id: 1 } })
    .sort({ createdAt: -1 })
    .skip(MAX_STORED_MESSAGES)
    .toArray();

  if (olderMessages.length === 0) {
    return;
  }

  await collection.deleteMany({
    _id: {
      $in: olderMessages.map(message => message._id),
    },
  });
}
