const __constants = require('../../config/constants')
const Pool = require('../../lib/db/postgres').pool
const { deleteMessages, deleteTopics } = require('../../queries/elasticsearch/delete')

class DeleteTopic {
  async deleteTopics (data) {
    try {
      const deletedMessages = await Pool.query(deleteMessages(data))
      if (deletedMessages.rowCount === 0) {
        return __constants.RESPONSE_MESSAGES.NO_DELETE_MSG
      }
      const deletedTopics = await Pool.query(deleteTopics(data))
      if (deletedTopics.rowCount === 0) {
        return __constants.RESPONSE_MESSAGES.NO_DELETE_TOPIC
      }
      return true
    } catch (error) {
      console.log('18 ::', error)
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new DeleteTopic()
