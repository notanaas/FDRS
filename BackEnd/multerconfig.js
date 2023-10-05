const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // Max file size (30 MB)
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'file') {
      if (!file.mimetype.includes('pdf')) {
        return cb(new Error('Only PDF files are allowed.'));
      }
    } else if (file.fieldname === 'img') {
      if (!file.mimetype.includes('jpeg') && !file.mimetype.includes('jpg') && !file.mimetype.includes('png')) {
        return cb(new Error('Only JPEG, JPG, and PNG images are allowed.'));
      }
    }
    cb(null, true);
  },
});

module.exports = { upload };
