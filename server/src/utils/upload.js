const path = require('path');
const multer = require('multer');

// Upload setting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('public/temp'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        '.' +
        String(file.originalname).split('.').pop()
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Image only supports'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('file');

module.exports = upload;
