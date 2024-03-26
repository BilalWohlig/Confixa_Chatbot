const __constants = require('../../config/constants')
const { getindex } = require('../../services/elasticsearch/getindexes')
const { getGeminiResponse } = require('../elasticsearch/gemini')
const { getClaudeResponse } = require('../elasticsearch/claude')
const { getGPTResponse } = require('../elasticsearch/gpt')
const { cleanResponse } = require('../elasticsearch/datacleanup')
const { getresponse } = require('../elasticsearch/getresponses')
const { getGeminiResponse2 } = require('../elasticsearch/gemini2')
const { verify } = require('../elasticsearch/verifyGemini')
const moment = require('moment')
class GetBotResponse {
  async getBotResponse (data) {
    try {
      // Get indexes
      const indexes = await getindex(data)
      if (!indexes) {
        return __constants.RESPONSE_MESSAGES.FAILED
      }

      // var geminiResponse = await getGeminiResponse(indexes, data)

      var gptResponse = await getGPTResponse(data)

      console.log('Response from GPT', gptResponse)

      // const claudeResponse = await getClaudeResponse()

      // return claudeResponse

      // console.log("before parse", geminiResponse)
      if (typeof (gptResponse) !== 'object') {
        var gptResponseJSON = JSON.parse(gptResponse)
      }
      // // const geminiResponseJSON = JSON.parse(geminiResponse)
      console.log('GPTTTT', gptResponseJSON)
      if (gptResponse.status_code) {
        return __constants.RESPONSE_MESSAGES.FAILED
      }
      // // const cleanedResponse = await cleanResponse(geminiResponse, data)
      // // console.log('cleanResponse', cleanedResponse)
      if (!gptResponseJSON.Index) {
        return __constants.RESPONSE_MESSAGES.BOT
      }
      const cleanedResponse = {
        Index: gptResponseJSON.Index,
        startTime: gptResponseJSON.startTime,
        endTime: gptResponseJSON.endTime
      }

      const verifiedResponse = await verify(cleanedResponse)
      if (verifiedResponse.status_code) {
        return verifiedResponse
      }
      if (verifiedResponse.startTime == null || isNaN(verifiedResponse.startTime)) {
        verifiedResponse.startTime = 0
      }
      if (verifiedResponse.endTime == null || isNaN(verifiedResponse.endTime)) {
        verifiedResponse.endTime = Date.now()
      }
      console.log('verify', verifiedResponse)

      const txns = await getresponse(gptResponseJSON, verifiedResponse)
      if (txns !== true) {
        // const resp = __constants.RESPONSE_MESSAGES.FAILED
        // return [txns, resp]
        return txns
      }
      // const GeminiResponse2 = await getGeminiResponse2(data)
      // console.log("GeminiResponse2", GeminiResponse2)
      // if (GeminiResponse2.status_code) {
      //   return geminiResponse
      // }
      // return GeminiResponse2
    } catch (error) {
      console.log(error)
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new GetBotResponse()
