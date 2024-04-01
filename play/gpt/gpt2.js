const OpenAI = require('openai')
const fs = require('fs')

const openai = new OpenAI({
  apiKey: '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'
})

async function getGPTResponse2 (data) {
  const txn = fs.readFileSync('./transactionsSolo.json', 'utf8')
  // console.log("txn", txn)
  var completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
              'You are a helpful chatbot that provides an accurate answer to the user\'s question using all possible resources.'
      },
      {
        role: 'user',
        content: `Transactions Data: ${txn}.
            Above is the transaction data of some services from elastic search for a given time period. 
            This is user's question - Find my slowest service. 
            Answer the question based on the the transactions data of services provided to you. 
            Answer with complete information. 
            Don't give any answers where there is a chance for ambiguity.`
      }
    ],
    model: 'gpt-4-0125-preview',
    temperature: 0,
    top_p: 1
  })
  console.log(completion.choices[0].message.content)
}

getGPTResponse2()
