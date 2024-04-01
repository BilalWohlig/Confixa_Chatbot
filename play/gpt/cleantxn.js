const fs = require('fs')

// Load the data from the file
const data = JSON.parse(fs.readFileSync('transactionsSolo.json', 'utf8'))

// Initialize an object to store the results
const results = {}

// Loop through the data and calculate the average latency for each service
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
        'average latency in miliseconds': (averageLatency/1000),
        'totalDuration in miliseconds': (values.durationSum/1000),
        totalRequests: values.valueCount
    }
})

// Save the output to a file
fs.writeFileSync('outputt.json', JSON.stringify(output, null, 2))