import { Db, MongoClient } from 'mongodb';

declare global {
  var __networkMongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URL is not configured');
  }

  return uri;
}

function getDatabaseName(uri: string): string {
  const explicitName = process.env.NETWORK_MONGODB_DB || process.env.MONGODB_DATABASE;

  if (explicitName) {
    return explicitName;
  }

  try {
    const parsed = new URL(uri);
    const dbName = decodeURIComponent(parsed.pathname.replace(/^\/+/, '').split('/')[0] ?? '');

    return dbName || 'network';
  } catch {
    return 'network';
  }
}

export async function getNetworkDb(): Promise<Db> {
  const uri = getMongoUri();

  if (!globalThis.__networkMongoClientPromise) {
    const client = new MongoClient(uri);
    globalThis.__networkMongoClientPromise = client.connect();
  }

  const client = await globalThis.__networkMongoClientPromise;

  return client.db(getDatabaseName(uri));
}
