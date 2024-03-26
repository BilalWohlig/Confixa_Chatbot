const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const multerImageData = (fields) => {
  const multerFields = fields.map((field) => ({ name: field, maxCount: 1 }))

  return (req, res, next) => {
    upload.fields(multerFields)(req, res, async function (err) {
      try {
        if (err) {
          console.log('Multer error:', err.message)
          return res.status(400).json({ error: 'Multer error', details: err.message })
        }
        next()
      } catch (error) {
        console.error('Error processing uploaded file:', error)
        return res.status(500).json({ error: 'Internal server error', details: error.message })
      }
    })
  }
}

module.exports = {
  multerImageData
}
