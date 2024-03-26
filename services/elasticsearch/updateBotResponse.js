const __constants = require('../../config/constants')
const { saveUserPrompt, getUserId, getTopicId, updateBotResponse, updateTopicTitle } = require('../../queries/elasticsearch/ask')
const Pool = require('../../lib/db/postgres').pool

class UpdateBotResponse {
  async updateResponse (data) {
    try {
      // console.log("8updateresponse", data)
      const updatedTopicTitle = await Pool.query(updateTopicTitle(data))
      // console.log("updatedTopicTitle", updatedTopicTitle)
      const updated_reponse = await Pool.query(updateBotResponse(data))
      // console.log("updated_reponse", updated_reponse, data)
      if (data.flag) {
        return [data.bot_response, data.topic_id]
      }
      return [data.bot_response]
    } catch (error) {
      console.log('17 ::', error)
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new UpdateBotResponse()
