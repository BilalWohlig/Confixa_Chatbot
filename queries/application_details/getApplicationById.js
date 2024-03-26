const queries = {
  getApplicationById: (id) => ({
    text: 'SELECT * FROM "application_details" WHERE id = $1',
    values: [id]
  })
}

module.exports = queries
