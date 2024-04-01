const __constants = require('../../config/constants')
const fs = require('fs')

class CleanSvcTxn {
  async cleanSvcTxn () {
    try {
      const data = JSON.parse(fs.readFileSync('/Users/vaishnavikorgaonkar/Desktop/Confixa_Chatbot/services/elasticsearch/fullservicetxn.json', 'utf8'))
      const results = {}
      for (const item of data) {
        const source = item._source
        const serviceName = source.service.name
        const durationSum = source.transaction.duration.summary.sum
        const valueCount = source.transaction.duration.summary.value_count

        if (!results[serviceName]) {
          results[serviceName] = {
            durationSum: 0,
            valueCount: 0
          }
        }

        results[serviceName].durationSum += durationSum
        results[serviceName].valueCount += valueCount
      }
      console.log(results)
      // Convert the results to the desired format
      const output = Object.entries(results).map(([serviceName, values]) => {
        const averageLatency = values.durationSum / values.valueCount
        return {
          service_name: serviceName,
          'average latency in miliseconds': (averageLatency / 1000),
          'totalDuration in miliseconds': (values.durationSum / 1000),
          totalRequests: values.valueCount
        }
      })

      fs.writeFileSync('services/elasticsearch/cleanedSvcTxn.json', JSON.stringify(output, null, 2))
      return true
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new CleanSvcTxn()
