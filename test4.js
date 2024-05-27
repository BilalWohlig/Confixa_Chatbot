const fs = require('fs')

// Read the data from the file
// const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const data = JSON.parse(fs.readFileSync('/Users/vaishnavikorgaonkar/Desktop/Confixa_Chatbot/services/elasticsearch/rawErrors.json', 'utf-8'))

// Check if the data is an array, if not, wrap it in an array
const dataArray = Array.isArray(data) ? data : [data]

const services = {}

dataArray.forEach((hit) => {
  console.log('jugnu', hit)
  const serviceName = hit._source.service.name
  const kubernetes = hit._source.kubernetes
  const errorObj = hit._source.error
  const msg = hit._source.message
  const url = hit._source.url
  const service = hit._source.service
  const transaction = hit._source.transaction
  const timestamp = hit._source.timestamp

  if (!services[serviceName]) {
    services[serviceName] = {
      kubernetes,
      errorObj
    }
  }
}
)

fs.writeFileSync(
  'services/elasticsearch/errorsPyaar.json',
  JSON.stringify(services, null, 2)
)
