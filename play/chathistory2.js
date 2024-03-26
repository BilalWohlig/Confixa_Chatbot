const { GoogleGenerativeAI } = require('@google/generative-ai')

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBuFy2BC3Cl8n2O6dlaTWI7sJkKXMHk120')

async function run () {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const chat = model.startChat({
    history: [
    ]
  })

  const msg = 'Explain deep learing to young child in one sentence'
  const result = await chat.sendMessage(msg)
  const text = result.response.text()
  console.log('1', text, text.length)
  const msg2 = 'Give me summary of it'
  const result2 = await chat.sendMessage(msg2)
  const text2 = result2.response.text()
  console.log('2', text2, text2.length)
  console.log(await chat.getHistory())
  console.log('histories')
  const histories = await chat.getHistory()
  //  console.log(histories[0], histories[1])
  for (var message in histories) {
    console.log(histories[message])
  }
}

run()
