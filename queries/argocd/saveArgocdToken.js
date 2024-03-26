const queries = {
  saveArgocdToken: (body) => ({
    text: 'INSERT INTO configuration(argocd_token,user_id) VALUES($1,$2)',
    values: [body.argocd_token, body.user_id]
  }),
  updateUser: (user_id, argocd_token) => ({
    text: 'UPDATE configuration SET argocd_token = $2 WHERE user_id = $1',
    values: [user_id, argocd_token]
  })
}

module.exports = queries
