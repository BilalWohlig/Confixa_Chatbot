const queries = {
  deleteMessages: (data) => (
    {
      text: 'delete from messages where topic_id = $1',
      values: [data.topic_id]
    }),
  deleteTopics: (data) => (
    {
      text: 'delete from topics where topic_id = $1',
      values: [data.topic_id]
    }
  )

}

module.exports = queries
