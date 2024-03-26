const axios = require('axios')
const { GoogleAuth } = require('google-auth-library')

// Load the credentials from the JSON file
const auth = new GoogleAuth({
  credentials: JSON.parse(process.env.CLAUDE_KEYS),
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
})
class ClaudeModel {
  async getClaudeResponse () {
    const claudeAccessToken = await auth.getAccessToken()
    console.log(claudeAccessToken)
    const projectId = process.env.PROJECT_ID
    const model = process.env.CLAUDE_MODEL
    const location = process.env.LOCATION

    const response = await axios.post(
      `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/anthropic/models/${model}:streamRawPredict`,
      {
        anthropic_version: 'vertex-2023-10-16',
        messages: [
          {
            role: 'user',
            content: 'Hello!'
          }
        ],
        max_tokens: 256,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${claudeAccessToken}`
        }
      }
    )
    return response.data
  }
}

module.exports = new ClaudeModel()
