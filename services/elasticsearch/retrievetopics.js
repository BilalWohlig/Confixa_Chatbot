const __constants = require('../../config/constants')
const { getTopicsByUser } = require('../../queries/elasticsearch/topics')
const Pool = require('../../lib/db/postgres').pool

class RetrieveTopics {
  async getTopics (data) {
    try {
      console.log(data)
      const topicsByUser = await Pool.query(getTopicsByUser(data))
      if (topicsByUser.rowCount === 0) {
        return __constants.RESPONSE_MESSAGES.TOPIC_NOT_EXIST
      }
      return topicsByUser.rows
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new RetrieveTopics()
