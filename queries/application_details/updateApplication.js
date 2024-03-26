const queries = {
  updateApplication: (data) => {
    const updateFields = Object.keys(data).filter((key) => key !== 'id')
    return {
      text: `UPDATE "application_details" SET ${updateFields
            .map((field, index) => `"${field}" = $${index + 2}`)
            .join(', ')} WHERE id = $1`,
      values: [data.id, ...updateFields.map((field) => data[field])]
    }
  }
}

module.exports = queries
