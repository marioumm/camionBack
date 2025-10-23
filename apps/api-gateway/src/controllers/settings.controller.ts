/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { 
  Controller, 
  Post, 
  Get,
  Delete,
  Body,
  Inject,
  UseInterceptors, 
  UploadedFile
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom } from 'rxjs';
import { Express } from 'express'; 
import 'multer';

@Controller('admin/settings')
export class SettingsController {
  constructor(
    @Inject('SETTINGS_SERVICE') 
    private readonly settingsClient: ClientProxy
  ) {}

  @Post('upload-logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @UploadedFile()  
    file: Express.Multer.File,
  ) {
    if (!file) {
      return {
        success: false,
        message: 'No file uploaded',
        error: 'File is required'
      };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        success: false,
        message: 'Invalid file type',
        error: 'Only images are allowed (jpg, png, gif, webp)'
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
        success: false,
        message: 'File too large',
        error: 'Maximum file size is 2MB'
      };
    }

    console.log('File received for S3 upload:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer
    });

    try {
      const bufferArray = Array.from(file.buffer);
      
      const result = await firstValueFrom(
        this.settingsClient.send(
          { cmd: 'upload_logo' }, 
          {
            buffer: bufferArray,
            originalname: file.originalname,
            mimetype: file.mimetype,
          }
        )
      );

      return result;
    } catch (error) {
      console.error('S3 Upload error:', error);
      return {
        success: false,
        message: 'S3 upload failed',
        error: error.message
      };
    }
  }

  @Get('logo')
  async getCurrentLogo() {
    try {
      const result = await firstValueFrom(
        this.settingsClient.send({ cmd: 'get_logo_path' }, {})
      );
      return result;
    } catch (error) {
      console.error('Get S3 logo error:', error);
      return {
        success: false,
        message: 'Failed to get logo from S3',
        error: error.message
      };
    }
  }

  @Delete('logo')
  async deleteLogo(@Body() body: { s3Key: string }) {
    try {
      const result = await firstValueFrom(
        this.settingsClient.send({ cmd: 'delete_logo' }, body)
      );
      return result;
    } catch (error) {
      console.error('Delete S3 logo error:', error);
      return {
        success: false,
        message: 'Failed to delete logo from S3',
        error: error.message
      };
    }
  }
}
