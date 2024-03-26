const { Client } = require('@elastic/elasticsearch')
const fs = require('fs')

// Replace with your Elasticsearch endpoint and authentication credentials

const getindex = async () => {
  const client = new Client({
    node: 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com',
    auth: {
      username: 'elastic',
      password: 'I78LJM2elK9x7HUFEKJrmMHU'
    }
  })

  const response = await client.cat.indices({ format: 'json' })
  console.log(response)
  // // store the response in a json file
  fs.writeFileSync('./indexes.json', JSON.stringify(response, null, 2))
}

getindex()
