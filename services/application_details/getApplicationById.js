const Pool = require('../../lib/db/postgres').pool
const queries = require('../../queries/application_details/getApplicationById')
const __constants = require('../../config/constants')

const getApplication = async (data) => {
  try {
    console.log('data 89::', data)
    const getApplicationDetails = await Pool.query(
      queries.getApplicationById(data.id)
    )
    if (getApplicationDetails.rowCount > 0) {
      return getApplicationDetails.rows[0]
    } else {
      return __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND
    }
  } catch (error) {
    console.log('error getApplication 17 :: ', error)
    throw new Error('Error in getApplication: ' + error.message)
  }
}

module.exports = getApplication
