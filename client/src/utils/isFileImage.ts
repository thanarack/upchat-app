const isFileImage = (file: any) => {
  return file && file['type'].split('/')[0] === 'image';
};

export default isFileImage;
