const __constants = require('../../config/constants')
const { createTopic } = require('../../queries/elasticsearch/ask')
const { savequestion } = require('../../services/elasticsearch/saveQuestion')
const { updateResponse } = require('../../services/elasticsearch/updateBotResponse')
const { getBotResponse } = require('../../services/elasticsearch/getResponse')
const Pool = require('../../lib/db/postgres').pool
const { getUserId } = require('../../queries/elasticsearch/ask')
const { getTopicTitle } = require('../../queries/elasticsearch/ask')

class Chat {
  async startChat (data) {
    try {
      // get UserId
      const userId = await Pool.query(getUserId(data))
      if (userId.rowCount === 0) {
        return __constants.RESPONSE_MESSAGES.USER_ID_NOT_EXIST
      }
      data.user_id = userId.rows[0].user_id
      // new chat - create topic
      data.topic_title = __constants.TOPIC_TITLE
      if (!data.topic_id) {
        const createdTopic = await Pool.query(createTopic(data))
        console.log(createdTopic)
        data.topic_id = createdTopic.rows[0].topic_id
        data.flag = true
      } else {
        // if not new chat - get topic title
        const topicTitle = await Pool.query(getTopicTitle(data))
        data.topic_title = topicTitle.rows[0].title
      }
      const saved = await savequestion(data)
      if (saved.status_code) {
        return saved
      }
      const botResponse = await getBotResponse(data)
      return botResponse
      // const bot_response = btoa(data.user_prompt)
      // console.log("Bot response", bot_response)
      // return botResponse
      // if (bot_response.includes('status_code')) {
      //   console.log("Bot", bot_respoxnse)
      // }

      // data.bot_response = botResponse
      // console.log("ss", data)
      // const updated = await updateResponse(data)
      // return updated
    } catch (error) {
      console.log('44', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new Chat()
