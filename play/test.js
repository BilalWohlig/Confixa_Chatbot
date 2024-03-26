const fullString = '.ds-metrics-apm.transaction.1m-default-2024.03.06-000061'

// Regular expression to extract substring up to the third dot
const regex = /^([^.]*\.){3}/

// Use match() with the regular expression
const match = fullString.match(regex)

// Extracted substring
const extractedString = match ? match[0] : null

console.log(extractedString)
