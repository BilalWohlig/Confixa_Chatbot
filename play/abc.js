
// const { GoogleGenerativeAI } = require('@google/generative-ai')

// const genAI = new GoogleGenerativeAI('AIzaSyBuFy2BC3Cl8n2O6dlaTWI7sJkKXMHk120')
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

// model.countTokens()

async function verifyuserprompt (data) {
  let retries = 0
  const backoff = [1000, 2000, 4000]

  while (retries < backoff.length) {
    try {
      // Your existing code for processing the prompt
      return 1
    } catch (error) {
      if (error.code === 503) {
        console.warn('GenerativeAI overloaded, retrying in', backoff[retries], 'ms')
        await new Promise(resolve => setTimeout(resolve, backoff[retries]))
        retries++
      } else {
        throw error // Re-throw other errors
      }
    }
  }

  throw new Error('GenerativeAI failed after retries')
}
