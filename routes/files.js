let express = require('express');
let router = express.Router();

let upload = require('../config/multer');

import {
  uploadFiles,
  getFile,
  deleteFile,
  uploadSingleFile,
} from '../controllers/files';

router.post('/:id', upload.any(), uploadFiles);
router.put('/single', upload.single('image'), uploadSingleFile);
router.get('/:key', getFile);
router.delete('/:key', deleteFile);

export default router;
