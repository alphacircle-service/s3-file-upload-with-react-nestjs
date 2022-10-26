import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import StorageOptionFactory from './storage.option'

@Controller()
export class AppController {
  @UseInterceptors(
    FilesInterceptor('files', null, {
      storage: StorageOptionFactory.S3Options(),
    }),
  )
  @Post('file')
  uploadFile(@UploadedFiles() files: []) {
    console.log(files)
    return 'ok'
  }
}
