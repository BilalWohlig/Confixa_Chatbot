const axios = require('axios')
const __constants = require('../config/constants')

const callArgocdAPI = async (method, endpointurl, argocdtoken, data) => {
  console.log('EndPoint-->', endpointurl)
  try {
    const dataToSend = {
      method: method,
      url: __constants.ARGOCD_BASE_URL + data.domain_name + __constants.ARGOCD_BASE2_URL + endpointurl,
      headers: {
        Authorization: __constants.ARGO_BEARER + ' ' + argocdtoken
        // 'Content-Type': 'application/json',
        // Accept: 'application/vnd.github.v3+json'
      },
      data: data
    }
    console.log(dataToSend)
    const response = await axios(dataToSend)
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

module.exports = { callArgocdAPI }
