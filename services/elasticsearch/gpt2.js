const OpenAI = require('openai')
const fs = require('fs')

const openai = new OpenAI()

class GPTModel {
  async getGPTResponse2 (data) {
    const latencies = fs.readFileSync('services/elasticsearch/latencies.json', 'utf8')
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
          Above is the latency data of some APIs from elastic search for a given time period. The 'averageLatency' field is in milliseconds. Return final answer in milliseconds only. For giving an answer, look at the 'averageLatency' field only.
          This is user's question ${data.user_prompt}. Answer the question based on the the latency data provided to you. Answer with complete information. Don't give any answers where there is a chance for ambiguity.`
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
