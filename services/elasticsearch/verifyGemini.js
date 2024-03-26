const __constants = require('../../config/constants')
const moment = require('moment')

function isEpoch (str) {
  if (typeof str !== 'string') return false
  const epoch = !isNaN(str) && !isNaN(parseFloat(str))
  // console.log(epoch)
  if (epoch) {
    const parsed = moment(parseInt(str))
    if (parsed.isValid()) {
      str = parsed.valueOf()
    } else {
      str = 0
    }
  } else {
    return 'Invalid'
  }
  return str
}

class VerifyGeminiResponse {
  async verify (cleanedResponse) {
    try {
      if (!cleanedResponse.startTime) {
        cleanedResponse.startTime = 0
      }
      if (!cleanedResponse.endTime) {
        cleanedResponse.endTime = Date.now()
      }
      const startEpoch = isEpoch((cleanedResponse.startTime).toString())
      if (startEpoch === 'Invalid') {
        cleanedResponse.startTime = moment(cleanedResponse.startTime).unix()
      }
      const endEpoch = isEpoch((cleanedResponse.endTime).toString())
      if (endEpoch === 'Invalid') {
        cleanedResponse.endTime = moment(cleanedResponse.endTime).unix()
      }
      return cleanedResponse
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new VerifyGeminiResponse()
