const axios = require('axios')
const __constants = require('../config/constants')

const callGitHubAPI = async (method, endpointurl, githubtoken, data) => {
  console.log('EndPoint-->', endpointurl, data)
  try {
    const dataToSend = {
      method: method,
      url: __constants.GITHUB_BASE_URL + endpointurl,
      headers: {
        Authorization: __constants.TOKEN + ' ' + githubtoken,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json'
      },
      data: data
    }
    const response = await axios(dataToSend)
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

module.exports = { callGitHubAPI }
