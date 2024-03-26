const Pool = require('../../lib/db/postgres').pool
const queries = require('../../queries/application_details/createApplications')
const __constants = require('../../config/constants')
const flow2 = require('../../controllers/github/flow2')
const axios = require('axios')
const webservice = require('../github/superservice')

const createNewApplication = async (data) => {
  try {
    const githubtoken = data.req.headers.authorization
    let newData = data.req.body
    const files = data.req.files

    const encodedFiles = Object.fromEntries(Object.entries(files).map(([key, fileArray]) => {
      const fieldName = fileArray[0].fieldname
      const fileBuffer = fileArray[0].buffer
      const base64EncodedFile = fileBuffer.toString('base64')
      return [fieldName, base64EncodedFile]
    }))

    const { created_by, created_on, updated_by, updated_on } = data
    newData = {
      ...newData,
      ...encodedFiles,
      created_by,
      created_on,
      updated_by,
      updated_on
    }

    console.log('newData ::::', newData)
    const webserviceresult = await webservice.webservice(githubtoken, {
      message: 'created successfully',
      branch: newData.branch_name,
      username: newData.user_name,
      reponame: newData.repo_name,
      filename: 'github_action.yaml',
      dockerfile: newData.docker_image_data,
      secretfile: newData.secrets_data,
      servicename: newData.application_name
    })
    console.log('webserviceresult----', webserviceresult)
    if (webserviceresult.message) {
      return webserviceresult
    } else {
      const response = await Pool.query(queries.insertNewApplication(newData))
      console.log('response 90::', response.rows)
      if (response.rows) {
        return __constants.RESPONSE_MESSAGES.SUCCESS
      }
      return __constants.RESPONSE_MESSAGES.FAILED
    }

    // const checkApplicationExits = await Pool.query(
    //   queries.checkApplicationAlreadyExists(newData.user_id)
    // )

    // if (checkApplicationExits.rows[0]) {
    //   return __constants.RESPONSE_MESSAGES.USER_EXIST
    // }
  } catch (error) {
    console.log('error createNewApplications 16 :: ', error)
    const resData = {}
    resData.data = __constants.RESPONSE_MESSAGES.USER_ADD_FAILED
    resData.error = error
    return resData
  }
}

module.exports = createNewApplication
