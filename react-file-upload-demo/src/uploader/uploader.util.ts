/**
 * 한글 인코딩 지원을 위한 file name 인코딩
 * @returns URI string encoded file
 */
export const encodeURINamedFile = (file: File): File => {
  return new File([file], encodeURI(file.name));
};
