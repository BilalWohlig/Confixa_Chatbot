const { Client } = require('@elastic/elasticsearch')
const __constants = require('../../config/constants')
const fs = require('fs')
const moment = require('moment')

class GetResponse {
  async getresponse (geminiResponse, data) {
    try {
      const client = new Client({
        node: 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com',
        auth: {
          // username: "elastic",
          // password: "I78LJM2elK9x7HUFEKJrmMHU"
          apiKey: 'dnhFNzBJMEJfME1uVlRZSVM2NmM6dXlYYXBJZFZUVUd2b1Y1bkRrS0N3dw=='
        }
      })
      // data.Index = data.Index.replaceAll('"', '')
      // data.Index = data.Index.trim()
      // data.startTime = data.startTime.replaceAll('"', '')
      // data.startTime = data.startTime.trim()
      // data.endTime = data.endTime.replaceAll('"', '')
      // data.endTime = data.endTime.trim()
      console.log('DATA INDEXXX ', data.Index)
      // const removeSurroundingPeriods = text => text.replace(/^\.|\.$/g, '')
      // data.Index = removeSurroundingPeriods(data.Index)
      // const numDots = data.Index.split('.').length - 1
      // console.log("cleaned index", data.Index)
      var dataStream = `${data.Index}-*`
      // if (numDots === 2) {
      //   var dataStream = `.${data.Index}.*`
      // } else {
      //   dataStream = `.${data.Index}.*`
      // }

      const startTime = parseInt(data.startTime)
      const endTime = Number(data.endTime)
      const size = 100
      console.log(dataStream, startTime, endTime)

      let convertedStartTime = moment.unix(startTime)
      let convertedEndTime = moment.unix(endTime)
      console.log('*******', convertedStartTime, convertedEndTime)

      convertedStartTime = convertedStartTime.format('YYYY-MM-DDTHH:mm:ss')
      convertedEndTime = convertedEndTime.format('YYYY-MM-DDTHH:mm:ss')

      console.log(convertedStartTime, convertedEndTime)
      const query = {
        size,
        query: {
          range: {
            '@timestamp': {
              gte: 'now-1h',
              lte: 'now'
              // format: "yyyy-MM-dd'T'HH:mm:ss",
              // time_zone: "+05:30"
            }
          }
        }
      }
      // console.log("QUERYYYYY ", query)

      const txn = await client.search({
        index: dataStream,
        body: query
      })
      // console.log(txn)
      const hits = txn?.hits?.hits
      console.log(`Found ${hits.length} transactions:`)
      if (!hits) {
        return geminiResponse
      }
      if (hits.length === 0) {
        return `No Transactions Found Matching the User Request. Use ${JSON.stringify(geminiResponse)}`
      }
      var totalTxn = []
      hits.forEach((hit) => {
        // console.log(hit._source.transaction)
        // return
        const source = {

        }
        // const source = {
        //   transactionData: hit._source.transaction,
        //   spanData: hit._source.span
        // }
        if (hit._source.transaction.result) {
          source.transactionData = hit._source.transaction
        } else {
          source.spanData = hit._source.span
        }
        source.id = hit._source.transaction.id
        totalTxn.push(source)
      })

      fs.writeFileSync('services/elasticsearch/transactions.json', JSON.stringify(totalTxn, null, 2))
      fs.writeFileSync('services/elasticsearch/fullTransactions.json', JSON.stringify(hits, null, 2))
      console.log('Writtennnnn')
      return true
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new GetResponse()
