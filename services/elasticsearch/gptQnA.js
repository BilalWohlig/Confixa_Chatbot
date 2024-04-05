const OpenAI = require('openai')
const fs = require('fs')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

class GPTModel {
  async getGPTResponse2 (data, apis, type) {
    if(type == 'latency') {
      console.log(apis)
      // const latencies = fs.readFileSync('services/elasticsearch/latencies.json', 'utf8')
      const traces = fs.readFileSync('services/elasticsearch/traceCleaned.json', 'utf8')
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful chatbot that provides an accurate answer to the user\'s question using all possible resources. Just keep in mind that "slowest" means high latency and "fastest" means low latency.'
          },
          {
            role: 'user',
            content: `Latency Data: ${apis}.
            Trace Data: ${traces}.
            Utilize the latency data from above and the appropriate trace data provided to you to answer the user's question.
            Provide each api's appropriate detailed trace breakdown from the trace data provided to you. If an api has multiple transactions in the trace data provided, list only the slowest one and mention it as the slowest one in your final answer and list its breakdown as well.
            For trace data, include the 'totalDuration' field as well in your answer.
            If no trace data is available for an api then mention that and the latency of that api as well but don't skip that api from your final answer.
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
              'You are a helpful chatbot that provides an accurate answer to the user\'s question using all possible resources. Just keep in mind that "slowest" means high latency and "fastest" means low latency.'
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
      const services = fs.readFileSync('services/elasticsearch/servicesCleaned.json', 'utf8')
      const traces = fs.readFileSync('services/elasticsearch/traceCleaned.json', 'utf8')
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful chatbot that provides an accurate answer to the user\'s question using all possible resources. Just keep in mind that "slowest" means high latency and "fastest" means low latency.'
          },
          {
            role: 'user',
            content: `Services Data: ${services}.
            Traces Data: ${traces}
            Analyze the user's question properly and provide an accurate answer. Use the Services Data and the Traces Data as reference. For any type of question, first list the service name and its average latency, then the data of the apis (see 'apiData' field in Service Data) belonging to that service and the trace breakdown (Use Trace Data) of those apis. For trace breakdown, if an api contains multiple transactions in the Trace Data, then make sure to list only the slowest transaction. For understanding how many apis and which apis data to list down, analyze the user's question and accordingly choose. Also provide a small analysis and suggestions as to how the latency can be improved for that particular api. By default, the time related data provided to you is in microseconds. For any type of duration or time related data, convert the data from microseconds to milliseconds and seconds.
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
