/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// settings-service/src/settings-service.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SettingsServiceService } from './settings-service.service';

@Controller()
export class SettingsServiceController {
  constructor(private readonly settingsService: SettingsServiceService) {}

  @MessagePattern({ cmd: 'upload_logo' })
  async uploadLogo(data: any) { 
    try {
      console.log('Received data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      console.log('Buffer type:', typeof data.buffer);
      
      let buffer: Buffer;
      
      if (data.buffer && typeof data.buffer === 'object') {
        if (data.buffer.data && Array.isArray(data.buffer.data)) {
          buffer = Buffer.from(data.buffer.data);
        } else if (Array.isArray(data.buffer)) {
          buffer = Buffer.from(data.buffer);
        } else {
          const arrayValues = Object.values(data.buffer);
          buffer = Buffer.from(arrayValues as number[]);
        }
      } else {
        throw new Error('Invalid buffer format received');
      }

      console.log('Buffer created successfully, size:', buffer.length);

      return await this.settingsService.saveLogo({
        buffer,
        originalname: data.originalname,
        mimetype: data.mimetype
      });

    } catch (error) {
      console.error('Upload error in controller:', error);
      return {
        success: false,
        message: 'Failed to process upload',
        error: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'get_logo_path' })
  async getLogoPath() {
    return await this.settingsService.getLogoPath();
  }

  @MessagePattern({ cmd: 'delete_logo' })
  async deleteLogo(data: { s3Key: string }) {
    return await this.settingsService.deleteLogo(data.s3Key);
  }
}
