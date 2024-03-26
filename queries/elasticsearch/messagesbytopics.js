const queries = {
  getMessagesByTopics: (data) => ({
    text: 'select * from messages where topic_id = $1 and user_id = (select user_id from users where username = $2) order by created_at DESC',
    values: [data.topic_id, data.username]
  })
}

module.exports = queries
