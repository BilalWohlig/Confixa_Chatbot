const fs = require('fs')
const path = require('path')
const { Client } = require('@elastic/elasticsearch')

class Search {
  async getResponse (data) {
    const client = new Client({
      node: 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com',
      auth: {
        apiKey: 'dnhFNzBJMEJfME1uVlRZSVM2NmM6dXlYYXBJZFZUVUd2b1Y1bkRrS0N3dw=='
      }
    })

    const dataStream = data.index
    const startTime = data.startTime
    const endTime = data.endTime
    const size = 100

    const query = {
      size,
      query: {
        range: {
          '@timestamp': {
            gte: startTime,
            lte: endTime
          }
        }
      }
    }

    try {
      const response = await client.search({
        index: dataStream,
        body: query
      })

      const hits = response.hits.hits
      console.log(`Found ${hits.length} transactions:`)

      const filePath = path.join(__dirname, 'transactions.json')
      await fs.promises.writeFile(filePath, JSON.stringify(hits, null, 2))

      hits.forEach((hit) => {
        const source = hit._source
        console.log(JSON.stringify(source))
      })
      return hits
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

module.exports = new Search()
