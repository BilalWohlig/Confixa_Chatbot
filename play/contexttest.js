const { GoogleGenerativeAI } = require('@google/generative-ai')
const Pool = require('../lib/db/postgres').pool
const genAI = new GoogleGenerativeAI('AIzaSyBuFy2BC3Cl8n2O6dlaTWI7sJkKXMHk120')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
const chat = model.startChat({
  history: [],
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2028
  }
})

async function one () {
  const resp = await chat.sendMessage("I want response for this prompt: Find my slowest api.  Check if the prompt is related to or is in the context of ElasticSearch in anyway.  If it is not related then respond back as you want. Respond back as { elasticsearch: true/false, gemini_response: 'your_response_if_response_not_related_to_elastic/ greet'}. ")
  const text = resp?.response?.text()
  console.log(text)
  const result2 = await chat.sendMessage('But it was related to elasticsearch')
  const text2 = result2?.response?.text()
  console.log(text2)

  const histories = await chat.getHistory()
  const jhdni = await saveHistory(histories)
  console.log(jhdni)
}

one()

async function saveHistory (histories) {
  try {
    console.log(histories)
    for (const message of histories) {
      const text = message.text || '' // Handle potential undefined text property
      const timestamp = message.timestamp || new Date().toISOString() // Use current timestamp if not provided
      // Insert each message into the database
      const queryy = 'INSERT INTO chat_history (text, timestamp) VALUES ($1, $2)'
      // console.log(queryy)
      const ex = await Pool.query(queryy, [text, timestamp])
      console.log(ex)
    }
    console.log('Chat history saved successfully!')
  } catch (error) {
    console.error('Error saving chat history:', error)
  }
}
