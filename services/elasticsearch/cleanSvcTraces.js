const __constants = require('../../config/constants')
const fs = require('fs')
class CleanSvcTraces {
  async cleanSvcTraces () {
    try {
      console.log('radhe')
      var svcTxn = fs.readFileSync('services/elasticsearch/fullservicetxn.json', 'utf8')
      svcTxn = JSON.parse(svcTxn)
      const result = {}
      svcTxn.forEach(item => {
        const serviceName = item._source.service.name
        const transactionName = item._source.transaction.name
        const durationSum = item._source.transaction.duration.summary.sum
        const valueCount = item._source.transaction.duration.summary.value_count

        // Create a new entry in the result object if the service name is not present
        if (!result[serviceName]) {
          result[serviceName] = []
        }

        // Add the transaction details to the service entry
        result[serviceName].push({
          'API url': transactionName,
          sum: durationSum,
          value_count: valueCount
        })
      })

      const outputJSON = JSON.stringify(result, null, 2)
      fs.writeFileSync('services/elasticsearch/cleanedServiceTraces.json', outputJSON)
      return true
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new CleanSvcTraces()
