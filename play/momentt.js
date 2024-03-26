const moment = require('moment')
const cleanedResponse = {
//   startTime: '1710396616016',
//   startTime: NaN,
//   startTime: '2024-03-15T12:32:31Z',
  endTime: NaN
//   endTime: 1710396616016
//   endTime: '2024-03-15T12:32:31Z'
}

function isEpoch (str) {
  if (typeof str !== 'string') return false
  const epoch = !isNaN(str) && !isNaN(parseFloat(str))
  console.log(epoch)
  if (epoch) {
    const parsed = moment(parseInt(str))
    console.log('parsed', parsed)
    if (parsed.isValid()) {
      str = parsed.valueOf()
    } else {
      str = 0
    }
  } else {
    return 'Invalid'
  }
  return str
}
async function verify (cleanedResponse) {
  if (!cleanedResponse.startTime) {
    cleanedResponse.startTime = 0
  }
  if (!cleanedResponse.endTime) {
    cleanedResponse.endTime = Date.now()
  }
  const start_epoch = isEpoch((cleanedResponse.startTime).toString())
  if (start_epoch === 'Invalid') {
    cleanedResponse.startTime = moment(cleanedResponse.startTime).unix()
  }
  const end_epoch = isEpoch((cleanedResponse.endTime).toString())
  if (end_epoch === 'Invalid') {
    cleanedResponse.endTime = moment(cleanedResponse.endTime).unix()
    console.log('dabba', cleanedResponse.endTime)
  }
}

verify(cleanedResponse)

console.log(cleanedResponse)
