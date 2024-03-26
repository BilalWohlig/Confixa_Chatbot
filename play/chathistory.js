// const __constants = require('../../config/constants')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs')

class GeminiModel {
  async getGeminiResponse (indexes, data) {
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyBuFy2BC3Cl8n2O6dlaTWI7sJkKXMHk120')
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const chat = model.startChat({
        history: [
        ],
        generationConfig: {
          temperature: 0,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048
        }
      })

      const index_data = fs.readFileSync('indexes.json', 'utf8')
      const info = fs.readFileSync('information.csv', 'utf8')
      // console.log(info)
      var msg = `${index_data}
      Above are my indexes from elasticsearch. 
      ${info} is short information about those indexes.
      This is user's prompt ${data.user_prompt}. Analyze the above indexes and tell me which index should I use to query elasticsearch. Give me only the name of the index and exclude the time metioned in the index name. For example:
      1. Index = .ds-metrics-apm.service_transaction.1m-default-2024.01.31-000050
      Index Name = .ds-metrics-apm.service_transaction
      2. Index = .ds-metrics-apm.service_summary.1m-default-2024.02.07-000052
      Index Name = .ds-metrics-apm.service_summary
      3. Index = .internal.alerts-observability.threshold.alerts-default-000001
      Index Name = .internal.alerts-observability.threshold.alerts
      4. Index = .ds-metrics-apm.app.apm_server-default-2024.02.21-000001
      Index Name = .ds-metrics-apm.app.apm_server
      5. Index = .kibana-observability-ai-assistant-conversations-000001
      Index Name = .kibana-observability-ai-assistant-conversations
      Also, provide me with a timestamp the end time is ${Date.now()} and start time is ${Date.now() - (24 * 60 * 60 * 1000)}. Also give me a short title for this response. Give me response as "{Title:"short_title_for_the_context_of_the_topic", Index: "just_the_name_of_the_index_without_time_ahead_of_it", startTime: "start time timestamp", endTime: "endTime"}".`
      const result = await chat.sendMessage(msg)
      const text = result?.response?.text()
      console.log(text)
      // return text
    } catch (error) {
      console.log('30 ::', error)
      // return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

const data = {
  user_prompt: 'Give my errors',
  username: 'User7',
  topic_id: 2000
}

const obj = new GeminiModel()
obj.getGeminiResponse('', data)
