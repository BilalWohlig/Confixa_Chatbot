const __constants = require('../../config/constants')
const { getMessagesByTopics } = require('../../queries/elasticsearch/messagesbytopics')
const Pool = require('../../lib/db/postgres').pool

class RetrieveMessagesByTopic {
  async getMessagesFromTopics (data) {
    try {
      const topicsByUser = await Pool.query(getMessagesByTopics(data))
      if (topicsByUser.rowCount === 0) {
        return __constants.RESPONSE_MESSAGES.NO_MESSAGES
      }
      return topicsByUser.rows
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new RetrieveMessagesByTopic()
