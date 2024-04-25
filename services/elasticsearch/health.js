const __constants = require('../../config/constants')
const axios = require('axios')
const { Client } = require('@elastic/elasticsearch')

class Health {
  async checkHealth () {
    try {
        const client = new Client({
            node: 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com',
            auth: {
              // username: "elastic",
              // password: "I78LJM2elK9x7HUFEKJrmMHU"
              apiKey: 'dnhFNzBJMEJfME1uVlRZSVM2NmM6dXlYYXBJZFZUVUd2b1Y1bkRrS0N3dw=='
            }
          })
      const healthData = await client.healthReport()
      return healthData
    } catch (error) {
      console.log(error)
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new Health()
