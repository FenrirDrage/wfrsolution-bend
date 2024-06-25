const multer = require('multer');

// Configuração do Multer para armazenar o arquivo na memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload };