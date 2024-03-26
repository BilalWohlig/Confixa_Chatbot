const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs')
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBuFy2BC3Cl8n2O6dlaTWI7sJkKXMHk120')

async function run () {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const chat = model.startChat({
    history: [
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048
    }
  })

  var msg = fs.readFileSync('/Users/vaishnavikorgaonkar/Desktop/CONFIXA 2/services/elasticsearch/indexes.json', 'utf8')
  msg = msg + 'These are indexes from my elasticsearch. Which index and query should i use if i want to find my slowest api? Label index as Index and query as Query and use @timestamp instead of duration.us '
  const result = await chat.sendMessage(msg)
  const text = result.response.text()
  console.log('1', text, text.length)
}

run()
