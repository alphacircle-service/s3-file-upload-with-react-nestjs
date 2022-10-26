import { S3Client } from '@aws-sdk/client-s3'
import { existsSync, mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import * as multerS3 from 'multer-s3'
import { v4 as uuidv4 } from 'uuid'
import { credentials, region } from './config'

export default class StorageOptionFactory {
  //서버 로컬에 저장
  static DiskStorageOptions() {
    return diskStorage({
      destination(req, file, callback) {
        const uploadPath = 'public'
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath)
        }

        callback(null, uploadPath)
      },

      filename(req, file, callback) {
        console.log(file)

        callback(null, file.originalname)
      },
    })
  }
  //S3로 업로드
  static S3Options() {
    return multerS3({
      s3: new S3Client({
        region: region,
        credentials: credentials,
      }),
      bucket: 'app-develop-media',
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `${uuidv4()}`)
      },
      contentDisposition: (req, file, cb) => {
        console.log(file)

        cb(null, `attachment;filename=${file.originalname}`)
      },
    })
  }
}
