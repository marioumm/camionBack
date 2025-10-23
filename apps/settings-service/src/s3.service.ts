/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

constructor(private configService: ConfigService) {
  this.s3Client = new S3Client({
    region: this.configService.get<string>('AWS_REGION')!,
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
    },
  });
  this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
}

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
      
      this.logger.log(`File uploaded successfully: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      this.logger.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error('Error deleting file from S3:', error);
      throw error;
    }
  }

  getFileUrl(key: string): string {
    return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
  }
}         // `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`
