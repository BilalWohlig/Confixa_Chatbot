const queries = {
  saveGithubToken: (github_token, user_id) => ({
    text: 'INSERT INTO configuration(github_token,user_id) VALUES($1,$2)',
    values: [github_token, user_id]
  }),
  updateUser: (user_id, github_token) => ({
    text: 'UPDATE configuration SET github_token = $2 WHERE user_id = $1',
    values: [user_id, github_token]
  })
}

module.exports = queries
