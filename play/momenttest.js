// const moment = require('moment')
// var startTime = NaN
// var endTime = 1710399812614

// const unixx = moment.unix(endTime / 1000)

// // Check if the date is valid
// if (unixx.isValid()) {
//   const endTime2 = unixx.format('YYYY-MM-DD HH:mm:ss')
//   console.log("Valid Date:", endTime2, endTime2.valueOf())
// } else {
//   endTime = moment()
//   console.log("Invalid Date. Set to current date:", endTime.format('YYYY-MM-DD HH:mm:ss'))
// }

// const moment = require('moment')

// const cleanedResponse = {
//   startTime: '14 March 2024 1:32:49.400',
//   endTime: NaN
// }

// const pI = parseInt(cleanedResponse.startTime)
// cleanedResponse.startTime = pI

// // Input date in the specified format
// const startDate = moment(cleanedResponse.startTime)
// console.log(startDate)
// if (startDate.isValid()) {
//   cleanedResponse.startTime = startDate.valueOf()
// } else {
//   cleanedResponse.startTime = 0
// }

// const endDate = moment(cleanedResponse.endTime, 'DD MMMM YYYY HH:mm:ss.SSS')
// if (endDate.isValid()) {
//   cleanedResponse.endTime = endDate.valueOf()
// } else {
//   cleanedResponse.endTime = moment().valueOf()
// }

// console.log(cleanedResponse)

// const moment = require('moment')

// const cleanedResponse = {
//   startTime: 1710396616016,
//   endTime: NaN
// }
// var start = cleanedResponse.startTime
// var parsedDate = moment(start, moment.ISO_8601, true)
// console.log("parsedDate: " + parsedDate)
// console.log(parsedDate.isValid() && parsedDate.parsedLength === start.length)
// var unixx = moment(1710387275386).valueOf()
// console.log(start, unixx)
// console.log(unixx == cleanedResponse.startTime)
// cleanedResponse.startTime = parseInt(start)

// const date = moment(cleanedResponse.startTime, 'DD MMMM YYYY h:mm:ss.SSS')
// console.log(date.isValid())
// console.log(moment.isDate(date))
// const startDate = moment(parseInt(cleanedResponse.startTime))
// const startDate = moment(cleanedResponse.startTime)
// console.log(startDate)
// if (startDate.isValid()) {
//   cleanedResponse.startTime = startDate.valueOf()
// } else {
//   console.log("here", cleanedResponse.startTime)
//   const startDate = moment(parseInt(cleanedResponse.startTime))
//   console.log(startDate)
//   // }
//   cleanedResponse.startTime = 0
// }
// console.log(cleanedResponse)

// const endDate = moment(parseInt(cleanedResponse.endTime))
// if (endDate.isValid()) {
//   cleanedResponse.endTime = endDate.valueOf()
// } else {
//   cleanedResponse.endTime = moment().valueOf()
// }

// if (cleanedResponse.startTime === null || isNaN(cleanedResponse.startTime)) {
//   cleanedResponse.startTime = 0
// }
// if (cleanedResponse.endTime === null || isNaN(cleanedResponse.endTime)) {
//   cleanedResponse.endTime = 0
// }

const moment = require('moment')
const cleanedResponse = {
  startTime: '1710396616016',
  // startTime: '2024-03-15T12:32:31Z',
  endTime: NaN
}
cleanedResponse.startTime = cleanedResponse.startTime.toString()
function isEpoch (str) {
  if (typeof str !== 'string') return false // We only process strings!
  const epoch = !isNaN(str) && !isNaN(parseFloat(str))
  if (epoch) {
    const startDate = moment(parseInt(cleanedResponse.startTime))
    if (startDate.isValid()) {
      cleanedResponse.startTime = startDate.valueOf()
    } else {
      cleanedResponse.startTime = 0
    }
  } else {
    cleanedResponse.startTime = moment(cleanedResponse.startTime).unix()
  }
}
const epoch = isEpoch((cleanedResponse.startTime).toString())
console.log('epoch', epoch)
if (epoch) {
  const startDate = moment(parseInt(cleanedResponse.startTime))
  if (startDate.isValid()) {
    cleanedResponse.startTime = startDate.valueOf()
  } else {
    cleanedResponse.startTime = 0
  }
} else {
  cleanedResponse.startTime = moment(cleanedResponse.startTime).unix()
}

// const endDate = moment(parseInt(cleanedResponse.endTime))
// if (endDate.isValid()) {
//   cleanedResponse.endTime = endDate.valueOf()
// } else {
//   cleanedResponse.endTime = moment().valueOf()
// }
console.log(cleanedResponse)
