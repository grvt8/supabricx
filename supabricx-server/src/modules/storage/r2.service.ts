import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type UploadResult = {
  key: string;
  url: string;
};

type FileMetadata = {
  size: number;
  contentType: string;
  lastModified: Date;
  metadata: Record<string, string>;
};

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly publicUrl?: string;
  private readonly signedUrlExpiry: number;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.getRequiredConfig('r2.bucketName', 'R2_BUCKET_NAME');
    this.endpoint = this.getRequiredConfig('r2.endpoint', 'R2_ENDPOINT');
    this.publicUrl =
      this.configService.get<string>('r2.publicUrl') ??
      this.configService.get<string>('R2_PUBLIC_URL');
    this.signedUrlExpiry =
      this.configService.get<number>('r2.signedUrlExpiry') ??
      Number(this.configService.get<string>('R2_SIGNED_URL_EXPIRY') ?? 3600);

    const accessKeyId = this.getRequiredConfig(
      'r2.accessKeyId',
      'R2_ACCESS_KEY_ID',
    );
    const secretAccessKey = this.getRequiredConfig(
      'r2.secretAccessKey',
      'R2_SECRET_ACCESS_KEY',
    );

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<UploadResult> {
    const normalizedKey = this.normalizeKey(key);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: normalizedKey,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
      }),
    );

    const url = this.getFileUrl(normalizedKey);
    this.logger.log(`Uploaded file ${normalizedKey}`);
    return { key: normalizedKey, url };
  }

  uploadDiagram(
    diagramId: string,
    file: Buffer,
    format: 'png' | 'svg' | 'jpg' = 'png',
  ) {
    const key = `diagrams/${diagramId}/${Date.now()}.${format}`;
    const contentType = format === 'svg' ? 'image/svg+xml' : `image/${format === 'jpg' ? 'jpeg' : format}`;

    return this.uploadFile(key, file, contentType, {
      diagramId,
      type: 'diagram',
    });
  }

  uploadThumbnail(diagramId: string, file: Buffer) {
    const key = `thumbnails/${diagramId}/${Date.now()}.png`;
    return this.uploadFile(key, file, 'image/png', {
      diagramId,
      type: 'thumbnail',
    });
  }

  uploadCodeExport(
    userId: string,
    diagramId: string,
    file: Buffer,
    format: string,
  ) {
    const key = `exports/${userId}/${diagramId}/${Date.now()}.zip`;
    return this.uploadFile(key, file, 'application/zip', {
      userId,
      diagramId,
      format,
      type: 'export',
    });
  }

  uploadPdfExport(userId: string, diagramId: string, file: Buffer) {
    const key = `exports/${userId}/${diagramId}/${Date.now()}.pdf`;
    return this.uploadFile(key, file, 'application/pdf', {
      userId,
      diagramId,
      type: 'pdf-export',
    });
  }

  uploadUserFile(
    userId: string,
    file: Buffer,
    filename: string,
    contentType: string,
  ) {
    const safeFilename = this.sanitizeFilename(filename);
    const key = `uploads/${userId}/${Date.now()}-${safeFilename}`;
    return this.uploadFile(key, file, contentType, {
      userId,
      type: 'user-upload',
    });
  }

  getFileUrl(key: string): string {
    const normalizedKey = this.normalizeKey(key);
    const baseUrl = (this.publicUrl || `${this.endpoint}/${this.bucket}`).replace(
      /\/+$/,
      '',
    );

    return `${baseUrl}/${normalizedKey}`;
  }

  getDefaultSignedUrlExpiry(): number {
    return this.signedUrlExpiry;
  }

  async getSignedUrl(key: string, expiresInSeconds = this.signedUrlExpiry) {
    const normalizedKey = this.normalizeKey(key);
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: normalizedKey,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async downloadFile(key: string): Promise<Buffer> {
    const normalizedKey = this.normalizeKey(key);

    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: normalizedKey,
        }),
      );

      if (!response.Body) {
        throw new NotFoundException('File not found');
      }

      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      if (this.isNotFoundError(error)) {
        throw new NotFoundException('File not found');
      }

      this.logger.error(`Failed to download file ${normalizedKey}`, error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    const normalizedKey = this.normalizeKey(key);

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: normalizedKey,
      }),
    );

    this.logger.log(`Deleted file ${normalizedKey}`);
  }

  async deleteFiles(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.deleteFile(key)));
  }

  async listFiles(prefix: string, maxKeys = 100): Promise<string[]> {
    const response = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: this.normalizeKey(prefix),
        MaxKeys: maxKeys,
      }),
    );

    return (response.Contents ?? [])
      .map((entry) => entry.Key)
      .filter((key): key is string => Boolean(key));
  }

  async getFileMetadata(key: string): Promise<FileMetadata> {
    const normalizedKey = this.normalizeKey(key);

    try {
      const response = await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: normalizedKey,
        }),
      );

      return {
        size: response.ContentLength ?? 0,
        contentType: response.ContentType ?? 'application/octet-stream',
        lastModified: response.LastModified ?? new Date(),
        metadata: response.Metadata ?? {},
      };
    } catch (error) {
      if (this.isNotFoundError(error)) {
        throw new NotFoundException('File not found');
      }

      this.logger.error(`Failed to fetch metadata for ${normalizedKey}`, error);
      throw error;
    }
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.getFileMetadata(key);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }

      throw error;
    }
  }

  async cleanupOldExports(maxAgeDays = 7): Promise<number> {
    const files = await this.listFiles('exports/');
    const now = Date.now();
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    for (const key of files) {
      const metadata = await this.getFileMetadata(key);
      const ageMs = now - metadata.lastModified.getTime();

      if (ageMs > maxAgeMs) {
        await this.deleteFile(key);
        deletedCount += 1;
      }
    }

    this.logger.log(`Cleaned up ${deletedCount} old export files`);
    return deletedCount;
  }

  private getRequiredConfig(primaryKey: string, fallbackKey: string): string {
    const value =
      this.configService.get<string>(primaryKey) ??
      this.configService.get<string>(fallbackKey);

    if (!value) {
      throw new Error(`Missing required configuration: ${fallbackKey}`);
    }

    return value;
  }

  private normalizeKey(key: string): string {
    return key.replace(/^\/+/, '');
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private isNotFoundError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    const awsError = error as Error & {
      name?: string;
      $metadata?: { httpStatusCode?: number };
    };

    return (
      awsError.name === 'NotFound' ||
      awsError.name === 'NoSuchKey' ||
      awsError.$metadata?.httpStatusCode === 404
    );
  }
}
