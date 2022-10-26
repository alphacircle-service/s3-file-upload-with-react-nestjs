export type Progress = {
  key?: string;
  progress: number;
};
export interface IUploader {
  /**
   * 전체 파일들을 통째로 업로드 할 때 사용할 메서드
   */
  upload(
    endpoint: string,
    fieldKey: string,
    files: File[],
    onProgress: (progress: Progress) => void
  ): Promise<unknown>;

  /**
   * 병렬적으로 파일을 업로드 할 때 사용할 메서드
   */
  parallelUpload(
    endpoint: string | null,
    fieldKey: string | null,
    files: File[],
    onProgress: (progress: Progress) => void
  ): Promise<unknown>;
}
