const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const updateApp = require('../../services/application_details/updateApplication')

const validationSchema = {
  type: 'object',
  required: true,
  properties: {
    id: {
      type: 'number',
      minimum: 1
    },
    application_name: {
      type: 'string'
    },
    domain_name: {
      type: 'string'
    },
    branch_name: {
      type: 'string'
    },
    build_image_type: {
      type: 'number'
    },
    docker_image_data: {
      type: 'string'
    },
    env_variables_data: {
      type: 'string'
    },
    secrets_data: {
      type: 'string'
    },
    replica_set: {
      type: 'number'
    },
    user_id: {
      type: 'string'
    },
    org_id: {
      type: 'string'
    },
    repo_id: {
      type: 'string'
    },
    branch_id: {
      type: 'string'
    },
    created_on: {
      type: 'number'
    },
    created_by: {
      type: 'string'
    },
    updated_on: {
      type: 'number'
    },
    updated_by: {
      type: 'string'
    }
  },
  additionalProperties: false
}

const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}

const updateApplication = async (req, res) => {
  try {
    console.log('89::', req.body)
    const updatedBy = req?.user?.id || null
    const result = await updateApp({
      ...req.body,
      updated_by: updatedBy,
      updated_on: new Date()
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
    console.log('updateApplication err 64 :: ', err)
    return res.sendJson({
      type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR,
      err: err.err || err
    })
  }
}

router.post('/updateApplication', validation, updateApplication)
module.exports = router
