const OpenAI = require('openai')
const fs = require('fs')

const openai = new OpenAI()

class GPTModel {
  async getGPTResponse (data) {
    const index_data = fs.readFileSync('services/elasticsearch/indexes.json', 'utf8')
    // const info = fs.readFileSync('services/elasticsearch/information.csv', 'utf8')
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "You are a helpful assistant that helps in fetching the correct index from elastic search based on the index data that is provided to you. If the user's question is anything related to latency or average time/duration taken, choose .ds-metrics-apm.transaction index"
        },
        {
          role: 'user',
          content: `Indexes: ${index_data} 
            Above are my indexes from elasticsearch.
            This is user's prompt ${data.user_prompt}.
            Analyze the above indexes and tell me which index should I use to query elasticsearch based on the user prompt provided above. Be thorough with your choice of index.
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
            Also, provide me with a timestamp the end time is ${Date.now()} and start time is ${Date.now() - (1 * 60 * 60 * 1000)}. Also give me a short title for this response. Give me response as "{"Title":"short_title_for_the_context_of_the_topic", "Index": "just_the_name_of_the_index_without_time_ahead_of_it", "startTime": "start time timestamp", "endTime": "endTime"}".`
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
      top_p: 1
    })

    return completion.choices[0].message.content
  }
}

module.exports = new GPTModel()
