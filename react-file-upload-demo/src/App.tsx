/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import { useState } from "react";
import { APIUploader } from "./uploader/api-uploader";
import { DirectUploader } from "./uploader/direct-uploader";
import { IUploader, Progress } from "./uploader/IUploader";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
});

function App() {
  const [fileList, setFileList] = useState<FileList>();

  const upload = async (uploader: IUploader, isParallel: boolean) => {
    const END_POINT = "/file";
    const FIELD_KEY = "files";
    if (!fileList) throw new Error("fileList is empty");
    const files = Array.from(fileList);
    const onProgress = (progress: Progress) => console.log(progress);
    const uploadResult = isParallel
      ? await uploader.parallelUpload(END_POINT, FIELD_KEY, files, onProgress)
      : await uploader.upload(END_POINT, FIELD_KEY, files, onProgress);
    return uploadResult;
  };

  return (
    <div>
      <input
        multiple
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (!files) throw new Error("file error");
          setFileList(files);
        }}
      />

      <div>
        {fileList && Array.from(fileList).map((file) => `[${file.name}] `)}
      </div>

      <button
        onClick={async () => await upload(new APIUploader(apiClient), false)}
      >
        upload
      </button>

      <button
        onClick={async () => await upload(new APIUploader(apiClient), true)}
      >
        parallelUpload
      </button>

      <button onClick={async () => await upload(new DirectUploader(), true)}>
        direct upload
      </button>
    </div>
  );
}

export default App;
