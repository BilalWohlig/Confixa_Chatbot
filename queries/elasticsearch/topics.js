const queries = {
  getTopicsByUser: (data) => ({
    text: 'select  * from topics where user_id = (SELECT user_id FROM Users WHERE username = $1) ORDER BY updated_at DESC LIMIT 7',
    values: [data.username]
  })
}
module.exports = queries
