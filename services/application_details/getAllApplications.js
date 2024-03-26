const Pool = require('../../lib/db/postgres').pool
const queries = require('../../queries/application_details/getAllApplications')

const getAllApplications = async (data) => {
  try {
    data.search = data.search || ''
    console.log(data.search, 'data.search')
    const totalUsers = await Pool.query(queries.getAllApplications(data))
    const totalUsersArray = totalUsers.rows
    const decodedArray = totalUsersArray.map((item) => {
      return {
        ...item,
        docker_image_data: Buffer.from(item.docker_image_data, 'base64').toString('utf-8'),
        env_variables_data: Buffer.from(item.env_variables_data, 'base64').toString('utf-8'),
        secrets_data: Buffer.from(item.secrets_data, 'base64').toString('utf-8')
      }
    })
    const filteredCount = totalUsers.rowCount
    return {
      filteredCount,
      decodedData: decodedArray
    }
  } catch (error) {
    console.log('getAllUsers error 26 ', error)
    throw new Error('Error in getting users: ' + error.message)
  }
}

module.exports = getAllApplications
