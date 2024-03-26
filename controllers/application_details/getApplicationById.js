const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const getApplicationById = require('../../services/application_details/getApplicationById')

const validationSchema = {
  type: 'object',
  required: true,
  properties: {
    id: {
      type: 'number'
    }
  },
  additionalProperties: false
}

const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}

const getSingleApplication = async (req, res) => {
  try {
    console.log('req.query---->', req.body)
    const result = await getApplicationById({
      ...req.body
    })
    if (result.status_code || result.error) {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.FAILED,
        data: result
      })
    } else {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.SUCCESS,
        data: result
      })
    }
  } catch (err) {
    console.log('getApplicationById err 53 :: ', err)
    return res.sendJson({
      type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR,
      err: err.err || err
    })
  }
}

router.post('/getApplicationById', validation, getSingleApplication)
module.exports = router
