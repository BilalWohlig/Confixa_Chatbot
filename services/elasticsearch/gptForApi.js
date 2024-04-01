const OpenAI = require('openai')
const fs = require('fs')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

class GPTModel {
  async getGPTResponseForApi (data) {
    const latencies = fs.readFileSync('services/elasticsearch/latencies.json', 'utf8')
      // const traces = fs.readFileSync('services/elasticsearch/traceCleaned.json', 'utf8')
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              `You are a helpful chatbot that provides an accurate answer to the user's question using all possible resources.`
          },
          {
            role: 'user',
            content: `Latency Data: ${latencies}.
            Based on the latency data provided to you, answer the user's question accurately.
            For your answer, rely only on the 'averageLatency' field
            For any type of duration data, provide it in milliseconds and seconds. If there is some sort of ranking in the answer then, sort them according to the user's question.
            Question: ${data.user_prompt}
            Answer:`
          }
        ],
        model: 'gpt-4-0125-preview',
        temperature: 0,
        top_p: 1
      })
      return completion.choices[0].message.content
  }
}

module.exports = new GPTModel()
