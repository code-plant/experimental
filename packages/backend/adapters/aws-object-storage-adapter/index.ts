import { Readable } from "node:stream";

import {
  ObjectId,
  ObjectStorageAdapter,
} from "@this-project/backend-application-adapter";
import { env } from "@this-project/util-common-util/env";
import { S3 } from "aws-sdk";

export class AWSObjectStorageAdapter implements ObjectStorageAdapter {
  private readonly BUCKET_NAME: string;
  private readonly s3: S3;

  constructor() {
    this.BUCKET_NAME = env("AWS_OBJECT_STORAGE_ADAPTER_BUCKET");
    this.s3 = new S3({
      endpoint: env("AWS_OBJECT_STORAGE_ADAPTER_ENDPOINT"),
      credentials: {
        accessKeyId: env("AWS_OBJECT_STORAGE_ADAPTER_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_OBJECT_STORAGE_ADAPTER_SECRET_ACCESS_KEY"),
      },
      region: env("AWS_OBJECT_STORAGE_ADAPTER_REGION"),
      s3ForcePathStyle: true, // required for localstack
    }); // Initializes the S3 client
  }

  /**
   * Uploads a file to S3 as public.
   * @param id The ObjectId (key) for the file.
   * @param stream The Readable stream of the file.
   */
  async uploadPublic(id: ObjectId, stream: Readable): Promise<void> {
    await this.s3
      .upload({
        Bucket: "your-bucket-name",
        Key: id,
        Body: stream,
        ACL: "public-read", // This makes the object public
      })
      .promise();
  }

  /**
   * Uploads a file to S3 as private.
   * @param id The ObjectId (key) for the file.
   * @param stream The Readable stream of the file.
   */
  async uploadPrivate(id: ObjectId, stream: Readable): Promise<void> {
    await this.s3
      .upload({
        Bucket: "your-bucket-name",
        Key: id,
        Body: stream,
        ACL: "private", // Private by default, this is the default setting
      })
      .promise();
  }

  /**
   * Deletes an object from S3.
   * @param id The ObjectId (key) of the file to delete.
   */
  async delete(id: ObjectId): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: "your-bucket-name",
        Key: id,
      })
      .promise();
  }

  /**
   * Generates a public URL to access the object.
   * @param id The ObjectId (key) for the file.
   * @returns The public URL to access the file.
   */
  async generatePublicUrl(id: ObjectId): Promise<string> {
    const url = this.s3.getSignedUrl("getObject", {
      Bucket: "your-bucket-name",
      Key: id,
      Expires: 3600, // The URL expires in 1 hour (can be customized)
    });

    return url;
  }

  /**
   * Generates a temporary pre-signed URL to access the private object.
   * @param id The ObjectId (key) for the file.
   * @param expiresIn The expiration time in seconds (default 3600).
   * @returns The temporary URL to access the private file.
   */
  async generatePrivateUrl(
    id: ObjectId,
    expiresIn: number = 3600
  ): Promise<string> {
    const url = this.s3.getSignedUrl("getObject", {
      Bucket: "your-bucket-name",
      Key: id,
      Expires: expiresIn, // Custom expiration time (default is 1 hour)
    });

    return url;
  }
}
