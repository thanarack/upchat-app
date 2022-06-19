const generateHeader = () => {
  return {
    'x-api-key': 'x1x2x3x4x5',
  };
};

const generateHeaderWithToken = () => {
  return {
    'x-api-key': 'x1x2x3x4x5',
    Authorization: 'Bearer ' + window.localStorage.getItem('upchat-app-token'),
  };
};

export { generateHeader, generateHeaderWithToken };
