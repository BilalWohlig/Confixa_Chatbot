const __constants = require('../../config/constants')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs')

class GeminiModel {
  async getGeminiResponse (indexes, data) {
    let retries = 0
    const backoff = [1000, 2000, 4000]
    while (retries < backoff.length) {
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

        const index_data = fs.readFileSync('services/elasticsearch/indexes.json', 'utf8')
        const info = fs.readFileSync('services/elasticsearch/information.csv', 'utf8')
        // console.log(info)
        var msg = `Indexes: ${index_data} 
      Above are my indexes from elasticsearch.
      Information: ${info} is short explanation about each index.
      This is user's prompt ${data.user_prompt}.
      Analyze the above indexes and the short explanation provided about them and tell me which index should I use to query elasticsearch based on the user prompt provided above. Be thorough with your choice of index.
      Give me only the name of the index and exclude the time metioned in the index name. For example:
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
      Also, provide me with a timestamp the end time is ${Date.now()} and start time is ${Date.now() - (24 * 60 * 60 * 1000)}. Also give me a short title for this response. Give me response as "{"Title":"short_title_for_the_context_of_the_topic", "Index": "just_the_name_of_the_index_without_time_ahead_of_it", "startTime": "start time timestamp", "endTime": "endTime"}".`
        const result = await chat.sendMessage(msg)
        const text = result?.response?.text()
        return text
      } catch (error) {
        if (error.code === 503) {
          console.warn('GenerativeAI overloaded, retrying in', backoff[retries], 'ms')
          await new Promise(resolve => setTimeout(resolve, backoff[retries]))
          retries++
        } else {
          console.log('30 ::', error)
          return __constants.RESPONSE_MESSAGES.FAILED
        }
      }
    }
  }
}

module.exports = new GeminiModel()
