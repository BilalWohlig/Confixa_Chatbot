const __constants = require('../../config/constants')
const fs = require('fs')
class CleanedServiceTransactions {
  async cleanedServiceTransactions () {
    try {
      console.log('radhe')
      var services = fs.readFileSync('services/elasticsearch/serviceSummary.json', 'utf8')
      services = JSON.parse(services)
      const result = services.reduce((acc, curr) => {
        const { name } = curr;
        const { sum, value_count } = curr.duration.summary;
        const serviceName = curr.service.name

        if (!acc[serviceName]) {
          acc[serviceName] = []
        }

        acc[serviceName].push({
          apiUrl: name,
          totalDuration: sum,
          totalRequests: value_count,
        })

        return acc
      }, {})

      const outputJSON = JSON.stringify(result, null, 2)
      fs.writeFileSync('services/elasticsearch/cleanedServiceTransactions.json', outputJSON)
      return true
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new CleanedServiceTransactions()
