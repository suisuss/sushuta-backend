const multer = require('multer')

const multerMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
})


export default {
  multerMiddleware: multerMiddleware
}