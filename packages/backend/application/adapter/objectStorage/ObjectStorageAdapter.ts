import { Readable } from "node:stream";

export type ObjectId = string & { " ObjectId": never };

export interface ObjectStorageAdapter {
  uploadPublic(id: ObjectId, stream: Readable): Promise<void>;
  uploadPrivate(id: ObjectId, stream: Readable): Promise<void>;
  delete(id: ObjectId): Promise<void>;
  generatePublicUrl(id: ObjectId): Promise<string>;
  generatePrivateUrl(id: ObjectId, expiresInMs: number): Promise<string>;
}
