const OpenAI = require('openai')
const fs = require('fs')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

class GPTModel {
  async getGPTResponse2 (data, type) {
    console.log(data, type)
    if (type === 'latency') {
      const latencies = fs.readFileSync('services/elasticsearch/latencies.json', 'utf8')
      const traces = fs.readFileSync('services/elasticsearch/traceCleaned.json', 'utf8')
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful chatbot that provides an accurate answer to the user\'s question using all possible resources.'
          },
          {
            role: 'user',
            content: `Latency Data: ${latencies}.
            Trace Data: ${traces}.
            Utilize the latency data from above and the appropriate trace data provided to you to answer the user's question.
            For providing the latency, look at the 'averageLatency' field only.
            Also, while providing the latency of an api, provide its appropriate detailed trace breakdown as well from the trace data provided to you. If an api has multiple transactions in the trace data provided, list only the slowest one and mention it as the slowest one in your final answer and list its breakdown as well.
            For trace data, include the 'totalDuration' field as well in your answer.
            If no trace data is available for the api then mention that as well but don't skip that api.
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
    } else if (type === 'traces') {
      const traces = fs.readFileSync('services/elasticsearch/traceCleaned.json', 'utf8')
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful chatbot that provides an accurate answer to the user\'s question using all possible resources.'
          },
          {
            role: 'user',
            content: `Traces Data: ${traces}.
            Above is the traces data of an API from elastic search for a given time period.
            This is user's question ${data.user_prompt}. Answer the question based on the the trace data provided to you. Summarise the answer well and don't provide the transaction id. Only give summary and include the 'totalDuration' value in your answer as well. Also if the answer contains some sort of duration, give that duration in microseconds, milliseconds and seconds.`
          }
        ],
        model: 'gpt-4-0125-preview',
        temperature: 0,
        top_p: 1
      })
      return completion.choices[0].message.content
    } else if (type === 'services') {
      const svctxn = fs.readFileSync('services/elasticsearch/cleanedSvcTxn.json', 'utf8')
      const traces = fs.readFileSync('services/elasticsearch/cleanedServiceTraces.json', 'utf8')
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful chatbot that provides an accurate answer to the user\'s question using all possible resources.'
          },
          {
            role: 'user',
            content: `Service Transactions Data: ${svctxn}.
            Traces Data: ${traces}
            Utilize the service transactions data from above and the appropriate trace data provided to you to answer the user's question.
            For providing the latency, look at the 'average latency in miliseconds' field only.
            Also, while providing the latency of an service, provide its appropriate detailed trace breakdown as well from the trace data provided to you. 
            If an service has multiple transactions in the trace data provided, list only the slowest one and mention it as the slowest one in your final answer.
            For trace data, include the 'totalDuration' field as well in your answer.
            If no trace data is available for the api then mention that as well but don't skip that api.
            For any type of duration, provide it in milliseconds and seconds. 
            If there is some sort of ranking in the answer then, sort them according to the user's question.
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
}

module.exports = new GPTModel()
