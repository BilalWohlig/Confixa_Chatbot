const Pool = require('../../lib/db/postgres').pool
const queries = require('../../queries/application_details/updateApplication')
const __constants = require('../../config/constants')

const updateApplication = async (data) => {
  try {
    console.log('Data 66::', data)
    const changeClass = await Pool.query(queries.updateApplication(data))
    if (changeClass.rowCount > 0) {
      return __constants.RESPONSE_MESSAGES.SUCCESS
    } else {
      return __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND
    }
  } catch (error) {
    console.log('error updateDepartment 12 :: ', error)
    throw new Error('Error in updateDepartment : ' + error.message)
  }
}

module.exports = updateApplication
