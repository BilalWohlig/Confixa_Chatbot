const { Client } = require('@elastic/elasticsearch')
const moment = require('moment')
moment().format()
const fs = require('fs')
const client = new Client({
  node: 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com',
  auth: {
    // username: "elastic",
    // password: "I78LJM2elK9x7HUFEKJrmMHU"
    apiKey: 'dnhFNzBJMEJfME1uVlRZSVM2NmM6dXlYYXBJZFZUVUd2b1Y1bkRrS0N3dw=='
  }
})
const dataStream = '.ds-metrics-apm.transaction.*'
const startTime = 0
var endTime = Date.now()
const size = 5000

const getTxn = async () => {
  const query = {
    size,
    query: {
      range: {
        '@timestamp': {
          gte: 'now-1h',
          lte: 'now'
        }
      }
    }
  }
  // console.log(dataStream, query.query.range['@timestamp'])

  const response = await client.search({ index: dataStream, body: query })
  const hits = response.hits.hits
  console.log(`Found ${hits.length} transactions:`)
  // console.log(`Found ${hits.length} transactions:`)
  // var totalTxn = []
  // hits.forEach((hit) => {
  //   // console.log(hit._source.transaction)
  //   // return
  //   const source = hit._source.transaction
  //   totalTxn.push(source)
  // })

  fs.writeFileSync('transactionsSolo.json', JSON.stringify(hits, null, 2))
  // const transactions = fs.readFileSync('transactions.json', 'utf-8')
  // console.log(transactions)
}

getTxn()
