let express = require('express');
let router = express.Router();

let upload = require('../config/multer');

import {
  uploadFiles,
  getFile,
  deleteFile,
  uploadSingleFile,
} from '../controllers/files';

router.post('/:id', upload.single('image'), uploadFiles);
router.post('/single/:id', upload.single('image'), uploadSingleFile);
router.get('/:key', getFile);
router.delete('/:key', deleteFile);

export default router;
