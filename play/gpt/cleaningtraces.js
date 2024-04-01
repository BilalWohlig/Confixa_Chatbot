const fs = require('fs')

var data = fs.readFileSync('transactionsSolo.json', 'utf8')
data = JSON.parse(data)
const result = {}

// Iterate through the data
data.forEach(item => {
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

// Convert the result object to JSON string
const outputJSON = JSON.stringify(result, null, 2)

// Save the result to a file (or you can use it as needed)
fs.writeFileSync('cleanedServiceTraces.json', outputJSON)
