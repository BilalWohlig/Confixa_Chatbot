const queries = {
  userExists: (user_id) => ({
    text: 'SELECT user_id FROM configuration WHERE user_id = $1',
    values: [user_id]
  })
}

module.exports = queries
