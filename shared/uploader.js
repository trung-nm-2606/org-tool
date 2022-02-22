const multer = require('multer');
const path = require('path');

const ROOT_DIR = 'uploads';

const getStorage = (folder) => {
  const storage = multer.diskStorage({
    destination: `${ROOT_DIR}/${folder}`,
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
      cb(null, `${folder}_${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });
  return storage;
};

const Multer = (folder = 'tmp') => {
  const storage = getStorage(folder);
  return multer({ storage });
};

const Uploaders = {
  Image: Multer('images')
};

module.exports = Uploaders;
