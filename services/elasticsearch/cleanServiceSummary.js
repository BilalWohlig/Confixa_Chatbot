const __constants = require('../../config/constants')
const fs = require('fs')

class CleanServices {
  async cleanServices () {
    try {
      const data = JSON.parse(fs.readFileSync('./services/elasticsearch/fullServiceSummary.json', 'utf8'))
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
      // console.log(results)
      // Convert the results to the desired format
      const output = Object.entries(results).map(([serviceName, values]) => {
        const averageLatency = values.durationSum / values.valueCount
        return {
          service_name: serviceName,
          'average latency in miliseconds': Number((averageLatency / 1000).toFixed(2)),
          'totalDuration in miliseconds': Number((values.durationSum / 1000).toFixed(2)),
          totalRequests: values.valueCount
        }
      })

      fs.writeFileSync('services/elasticsearch/cleanedServiceSummary.json', JSON.stringify(output, null, 2))
      return true
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new CleanServices()
