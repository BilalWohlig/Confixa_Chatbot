const __constants = require('../../config/constants')
const { saveUserPrompt, getTopicId } = require('../../queries/elasticsearch/ask')
const Pool = require('../../lib/db/postgres').pool

class SaveQuestion {
  async savequestion (data) {
    try {
      const query3 = await Pool.query(saveUserPrompt(data))
      if (query3.rowCount === 0) {
        return __constants.RESPONSE_MESSAGES.INSERT_FAILED
      }
      return query3
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new SaveQuestion()
