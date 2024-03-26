const __constants = require('../../config/constants')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs')

class GeminiModel {
  async getGeminiResponse2 (data) {
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyBuFy2BC3Cl8n2O6dlaTWI7sJkKXMHk120')
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const chat = model.startChat({
        history: [
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 10000
        }
      })

      const txnData = fs.readFileSync('services/elasticsearch/transactions.json', 'utf8')
      // console.log(txn_data)
      var msg = ` ${txnData}
      Above is the transaction data of elasticsearch for a particular time period. This is user's question. ${data.user_prompt}. Answer the question based on the the transaction data provided to you. Answer with complete information. Don't give any answers where there is a chance for ambiguity.`
      // var msg = txnData + `If they greet you please greet them back. Tell me my ${data.user_prompt}`
      // console.log(msg)
      const result = await chat.sendMessage(msg)
      const text = result?.response?.text()
      // console.log("response2", text)
      return text
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new GeminiModel()
