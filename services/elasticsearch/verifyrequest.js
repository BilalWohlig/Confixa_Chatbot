const __constants = require('../../config/constants')
const { GoogleGenerativeAI } = require('@google/generative-ai')
class VerifyRequest {
  async verifyuserprompt (data) {
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
          maxOutputTokens: 1000
        }
      })
      var msg = ` I want response for this prompt: ${data.user_prompt}. 
                  Check if the prompt is related to or is in the context of ElasticSearch in anyway. 
                  If it is not related then respond back as you want. 
                  Respond back as { elasticsearch: true/false, gemini_response: 'your_response_if_response_not_related_to_elastic/ greet'}. `
      const result = await chat.sendMessage(msg)
      const text = result?.response?.text()
      console.log('verifyreq', text)
      const result2 = await chat.sendMessage('But it was related to elasticsearch')
      console.log(result2.response?.text())
      const histories = await chat.getHistory()
      //  console.log(histories[0], histories[1])
      for (var message in histories) {
        console.log(histories[message])
      }
      return 1
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new VerifyRequest()
