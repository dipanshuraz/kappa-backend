const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// var storage = multer.memoryStorage();
// var upload = multer({ storage: storage });

module.exports = upload;
