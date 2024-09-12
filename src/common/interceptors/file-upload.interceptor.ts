import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { fileUploadConfig } from '../../config/file-upload.config';

export function CustomFileInterceptor(
  fieldName: string,
  localOptions?: MulterOptions,
): Type<NestInterceptor> {
  @Injectable()
  class FileInterceptorMixin implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor() {
      const options: MulterOptions = {
        ...fileUploadConfig,
        ...localOptions,
      };

      this.fileInterceptor = new (FileInterceptor(fieldName, options))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(FileInterceptorMixin);
}
