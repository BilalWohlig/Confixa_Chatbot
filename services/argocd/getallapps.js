const __constants = require('../../config/constants')
const argocdAPI = require('../../common/argocdAPI')

class GetApps {
  async getapps (argocdtoken, data) {
    const method = 'GET'
    const endpointurl = '/applications'
    try {
      const response = await argocdAPI.callArgocdAPI(method, endpointurl, argocdtoken, data)
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        if (error.response?.data.message === 'Bad credentials') {
          return __constants.RESPONSE_MESSAGES.NOT_AUTHORIZED
        }
        return __constants.RESPONSE_MESSAGES.INVALID_REQUEST
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new GetApps()
