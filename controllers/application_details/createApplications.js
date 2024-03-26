const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const createNewApplication = require('../../services/application_details/createApplications')
const multerFileAPI = require('../../middlewares/multerFile')

const validationSchema = {
  type: 'object',
  required: true,
  // properties: {
  //   application_name: {
  //     type: 'string',
  //     required: true
  //   },
  //   domain_name: {
  //     type: 'string'
  //   },
  //   branch_name: {
  //     type: 'string',
  //     required: true
  //   },
  //   build_image_type: {
  //     type: 'number',
  //     required: true
  //   },
  //   docker_image_data: {
  //     type: 'string',
  //     required: true
  //   },
  //   env_variables_data: {
  //     type: 'string',
  //     required: true
  //   },
  //   secrets_data: {
  //     type: 'string',
  //     required: true
  //   },
  //   replica_set: {
  //     type: 'number',
  //     required: true
  //   },
  //   user_id: {
  //     type: 'string',
  //     required: true
  //   },
  //   org_id: {
  //     type: 'string',
  //     required: true
  //   },
  //   repo_id: {
  //     type: 'string',
  //     required: true
  //   },
  //   branch_id: {
  //     type: 'string',
  //     required: true
  //   },
  //   created_on: {
  //     type: 'number'
  //   },
  //   created_by: {
  //     type: 'string'
  //   },
  //   updated_on: {
  //     type: 'number'
  //   },
  //   updated_by: {
  //     type: 'string'
  //   }
  // },
  additionalProperties: false
}

const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}

const multerFilesMiddleware = multerFileAPI.multerImageData(['docker_image_data', 'env_variables_data', 'secrets_data'])

const createApplications = async (req, res) => {
  try {
    const result = await createNewApplication({
      req,
      created_by: req?.user?.id || null,
      updated_by: req?.user?.id || null,
      created_on: new Date(),
      updated_on: new Date()
    })
    if (result.code === 2000) {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.SUCCESS,
        data: result
      })
    } else {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.FAILED,
        data: result
      })
    }
  } catch (err) {
    console.log('createApplication err 61 :: ', err)
    return res.sendJson({
      type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR,
      err: err.err || err
    })
  }
}

router.post('/createNewApplication', validation, multerFilesMiddleware, createApplications)
module.exports = router
