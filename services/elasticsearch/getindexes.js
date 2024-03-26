const { Client } = require('@elastic/elasticsearch')
const __constants = require('../../config/constants')
const fs = require('fs')

// Replace with your Elasticsearch endpoint and authentication credentials

class GetIndex {
  async getindex () {
    try {
      const client = new Client({
        node: 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com',
        auth: {
          username: 'elastic',
          password: 'iNnIV9nI0SfJTKOdsYJAImLf'
        }
      })
      const response = await client.cat.indices({ format: 'json' })
      // console.log(response)
      // // store the response in a json file
      fs.writeFileSync('services/elasticsearch/indexes.json', JSON.stringify(response, null, 2))
      return true
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new GetIndex()
