import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CurrentUser,
  RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { R2Service } from './r2.service';

type UploadedBufferFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly r2Service: R2Service) {}

  @Post('diagram')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDiagram(
    @Body('diagramId') diagramId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(image\/png|image\/jpeg|image\/svg\+xml)$/,
          }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
      }),
    )
    file: UploadedBufferFile,
  ) {
    if (!diagramId) {
      throw new BadRequestException('diagramId is required');
    }

    const result = await this.r2Service.uploadDiagram(
      diagramId,
      file.buffer,
      this.resolveDiagramFormat(file),
    );

    return {
      success: true,
      ...result,
      filename: file.originalname,
      size: file.size,
    };
  }

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnail(
    @Body('diagramId') diagramId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(image\/png|image\/jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
        ],
      }),
    )
    file: UploadedBufferFile,
  ) {
    if (!diagramId) {
      throw new BadRequestException('diagramId is required');
    }

    const result = await this.r2Service.uploadThumbnail(diagramId, file.buffer);

    return {
      success: true,
      ...result,
      filename: file.originalname,
      size: file.size,
    };
  }

  @Post('export')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExport(
    @CurrentUser() user: RequestUser,
    @Body('diagramId') diagramId: string,
    @Body('format') format: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /application\/zip$/ }),
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }),
        ],
      }),
    )
    file: UploadedBufferFile,
  ) {
    if (!diagramId) {
      throw new BadRequestException('diagramId is required');
    }

    const result = await this.r2Service.uploadCodeExport(
      user.id,
      diagramId,
      file.buffer,
      format ?? 'zip',
    );
    const expiresInSeconds = this.r2Service.getDefaultSignedUrlExpiry();
    const signedUrl = await this.r2Service.getSignedUrl(result.key);

    return {
      success: true,
      key: result.key,
      url: signedUrl,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
      filename: file.originalname,
      size: file.size,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @CurrentUser() user: RequestUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })],
      }),
    )
    file: UploadedBufferFile,
  ) {
    const result = await this.r2Service.uploadUserFile(
      user.id,
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return {
      success: true,
      ...result,
      filename: file.originalname,
      size: file.size,
    };
  }

  @Get('file')
  async getFileUrl(
    @Query('key') key: string,
    @Query('signed') signed = 'true',
  ) {
    if (!key) {
      throw new BadRequestException('key is required');
    }

    if (signed === 'true') {
      return {
        key,
        url: await this.r2Service.getSignedUrl(key),
      };
    }

    return {
      key,
      url: this.r2Service.getFileUrl(key),
    };
  }

  @Delete('file')
  async deleteFile(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('key is required');
    }

    await this.r2Service.deleteFile(key);
    return { success: true, message: 'File deleted' };
  }

  private resolveDiagramFormat(
    file: UploadedBufferFile,
  ): 'png' | 'svg' | 'jpg' {
    if (file.mimetype === 'image/svg+xml') {
      return 'svg';
    }

    if (file.mimetype === 'image/jpeg') {
      return 'jpg';
    }

    return 'png';
  }
}
