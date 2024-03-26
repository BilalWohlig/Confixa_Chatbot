const queries = {
  getAllApplications: (data) => {
    const page = data.page || 1
    const pageSize = data.pageSize || 10 // Set a default value or adjust as needed
    const offset = (page - 1) * pageSize

    const query = 'SELECT * FROM "application_details"'
    const queryFilter = `WHERE  (user_name::text ILIKE $1)
            ORDER BY application_details.created_on DESC
            OFFSET $2
            LIMIT $3
            `
    return {
      text: query + queryFilter,
      values: [`%${data.search}%`, offset, pageSize]
    }
  },
  getDataCount: (data) => {
    const query = `select count(ad.*)   
            from application_details ad`
    return {
      text: query,
      values: [data.user_name]
    }
  }
}
module.exports = queries
