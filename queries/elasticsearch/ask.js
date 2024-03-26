const queries = {
  getUserId: (data) => ({
    text: 'SELECT user_id FROM Users where username = $1',
    values: [data.username]
  }),
  getTopicId: (data) => ({
    text: 'SELECT topic_id FROM Topics where title = $1',
    values: [data.topic_title]
  }),
  saveUserPrompt: (data) => ({
    text: 'INSERT INTO messages(question, user_id, topic_id, created_at, updated_at) VALUES($1,$2,$3,$4,$5)',
    values: [data.user_prompt, data.user_id, data.topic_id, new Date(), new Date()]
  }),
  updateBotResponse: (data) => ({
    text: 'UPDATE messages SET answer = $1, updated_at = $2 WHERE user_id = $3 and topic_id = $4 and message_id = (SELECT message_id FROM messages WHERE created_at = (select max(created_at) FROM messages))',
    values: [data.bot_response, new Date(), data.user_id, data.topic_id]
  }),
  createTopic: (data) => ({
    text: 'INSERT INTO topics (title, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4) returning topic_id, title',
    values: [data.topic_title, data.user_id, new Date(), new Date()]
  }),
  getTopicTitle: (data) => ({
    text: 'SELECT title FROM topics WHERE topic_id = $1',
    values: [data.topic_id]
  }),
  updateTopicTitle: (data) => ({
    text: 'UPDATE topics SET title = $1, updated_at = $2 WHERE topic_id = $3',
    values: [data.topic_title, new Date(), data.topic_id]
  })
}
module.exports = queries
