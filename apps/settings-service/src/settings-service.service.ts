/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// settings-service/src/settings-service.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from './s3.service';
import * as path from 'path';

@Injectable()
export class SettingsServiceService {
  private readonly logger = new Logger(SettingsServiceService.name);
  private currentLogoKey: string | null = null; 

  constructor(private readonly s3Service: S3Service) {}

  async saveLogo(data: { buffer: Buffer, originalname: string, mimetype: string }) {
    try {
      const ext = path.extname(data.originalname);
      const timestamp = Date.now();
      const fileName = `logo-${timestamp}${ext}`;
      const s3Key = `logos/${fileName}`;

      this.logger.log(`Uploading logo to S3: ${s3Key}`);

      const fileUrl = await this.s3Service.uploadFile(
        s3Key,
        data.buffer,
        data.mimetype
      );

      this.currentLogoKey = s3Key;

      this.logger.log(`Logo uploaded successfully to S3: ${fileUrl}`);

      return {
        success: true,
        message: 'Logo uploaded successfully to S3! ✅',
        filename: fileName,
        path: fileUrl, 
        s3Key: s3Key,
        size: data.buffer.length,
        bucket: process.env.AWS_S3_BUCKET_NAME
      };
    } catch (error) {
      this.logger.error('Error in saveLogo:', error);
      return {
        success: false,
        message: 'Failed to upload logo to S3',
        error: error.message
      };
    }
  }

   getLogoPath() {
    try {
      if (this.currentLogoKey) {
        const logoUrl = this.s3Service.getFileUrl(this.currentLogoKey);
        this.logger.log(`Returning current logo: ${logoUrl}`);
        
        return { 
          path: logoUrl,
          source: 's3',
          key: this.currentLogoKey
        };
      }

      this.logger.warn('No logo has been uploaded yet');
      return { 
        path: '/assets/default-logo.png',
        source: 'local',
        message: 'No logo uploaded yet - please upload a logo first!'
      };
      
    } catch (error) {
      this.logger.error('Error getting logo path:', error);
      return { 
        path: '/assets/default-logo.png',
        source: 'local',
        error: error.message
      };
    }
  }

  async deleteLogo(s3Key: string) {
    try {
      await this.s3Service.deleteFile(s3Key);
      
      if (this.currentLogoKey === s3Key) {
        this.currentLogoKey = null;
      }
      
      return {
        success: true,
        message: 'Logo deleted successfully from S3! 🗑️'
      };
    } catch (error) {
      this.logger.error('Error deleting logo:', error);
      return {
        success: false,
        message: 'Failed to delete logo from S3',
        error: error.message
      };
    }
  }
}
