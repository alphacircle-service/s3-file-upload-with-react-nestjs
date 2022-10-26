import { AxiosInstance, AxiosProgressEvent } from "axios";
import { IUploader, Progress } from "./IUploader";
import { encodeURINamedFile } from "./uploader.util";

/**
 * 백엔드 api로 업로드
 */
export class APIUploader implements IUploader {
  constructor(private readonly apiClient: AxiosInstance) {}

  async upload(
    endpoint: string,
    fieldKey: string,
    files: File[],
    onProgress: (progress: Progress) => void
  ) {
    return this.apiClient.post(endpoint, this._parseFormData(fieldKey, files), {
      onUploadProgress: this._onUploadProgress(onProgress),
    });
  }

  async parallelUpload(
    endpoint: string,
    fieldKey: string,
    files: File[],
    onProgress: (progress: Progress) => void
  ) {
    return Promise.all(
      this._parseFileArray(files).map(
        async (file) =>
          await this.apiClient.post(
            endpoint,
            this._parseFormData(fieldKey, [file]),
            {
              onUploadProgress: this._onUploadProgress(onProgress, file.name),
            }
          )
      )
    );
  }

  private _onUploadProgress =
    (cb: (progress: Progress) => void, key?: string) =>
    (progressEvent: AxiosProgressEvent) => {
      const { progress } = progressEvent;
      if (progress) cb({ key, progress });
    };

  private _parseFormData(fieldKey: string, files: File[]) {
    const result = new FormData();
    this._parseFileArray(files).forEach((file) =>
      result.append(fieldKey, file)
    );
    return result;
  }

  private _parseFileArray(files: File[]) {
    return files.map((file) => encodeURINamedFile(file));
  }
}
