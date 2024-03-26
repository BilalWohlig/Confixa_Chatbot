const queries = {
  insertNewApplication: (data) => {
    const fields = Object.keys(data)
    const placeholders = fields
      .map((field, index) => `$${index + 1}`)
      .join(', ')

    return {
      text: `INSERT INTO "application_details" (${fields
                  .map((field) => `"${field}"`)
                  .join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values: fields.map((field) => data[field])
    }
  }
  // checkApplicationAlreadyExists: (user_id) => ({
  //   text: 'SELECT * FROM "application_details" WHERE user_id = $1',
  //   values: [user_id]
  // })
}

module.exports = queries
