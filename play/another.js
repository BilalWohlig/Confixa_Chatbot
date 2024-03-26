// const Index = ".ds-metrics-apm.service_destination."
// const removeSurroundingPeriods = text => text.replace(/^\.|\.$/g, '')
// const modifiedString = removeSurroundingPeriods(Index)
// console.log(modifiedString)

function isValidISODateRegex (str) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
  return regex.test(str)
}

const validDate = '2024-02-25T00:00:00Z'
const invalidDate1 = '2024-02-30T00:00:00Z' // Invalid date (30 days in Feb)
const invalidDate2 = 'invalid string'

console.log(isValidISODateRegex(validDate)) // Output: true
console.log(isValidISODateRegex(invalidDate1))// Output: false (invalid date)
console.log(isValidISODateRegex(invalidDate2))// Output: false (doesn't match pattern)
