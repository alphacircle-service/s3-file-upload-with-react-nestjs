import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { IUploader, Progress } from "./IUploader";
import { encodeURINamedFile } from "./uploader.util";

export class DirectUploader implements IUploader {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.REACT_APP_AWS_REGION,
      credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY!,
      },
    });
  }

  upload(
    endpoint: string,
    fieldKey: string,
    files: File[],
    onProgress: (progress: Progress) => void
  ): Promise<unknown> {
    throw new Error("DirectUploader upload(...) Method not implemented.");
  }

  parallelUpload(
    endpoint: string, //not used
    fieldKey: string, //not used
    files: File[],
    onProgress: (progress: Progress) => void
  ): Promise<unknown> {
    return Promise.all(
      this._parseFileArray(files).map(async (file) => {
        const uploader = new Upload({
          client: this.s3Client,
          params: {
            ACL: "public-read",
            ContentDisposition: `attachment;filename=${file.name}`,
            Bucket: process.env.REACT_APP_BUCKET_NAME,
            Key: file.name,
            Body: file,
          },
        });

        uploader.on("httpUploadProgress", (_progress) => {
          if (_progress.loaded && _progress.total)
            onProgress({
              key: file.name,
              progress: _progress.loaded / _progress.total,
            });
        });

        return uploader.done();
      })
    );
  }

  /**
   * 이부분은 모든 uploader 에서 중복되므로 추후 IUploader 를 추상 클래스화 한뒤 중복 코드를 없앨것
   */
  private _parseFileArray(files: File[]) {
    return files.map((file) => encodeURINamedFile(file));
  }
}
