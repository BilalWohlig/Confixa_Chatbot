const __constants = require('../../config/constants')

class DataCleanUp {
  async cleanResponse (geminiResponse, data) {
    try {
      // topic title
      if (data.topic_title === __constants.TOPIC_TITLE) {
        console.log(geminiResponse, data)
        if (geminiResponse.includes('Title')) {
          var lableTitleLength = 'Title'.length
          const GeminiTitleStart = geminiResponse.indexOf('Title')
          lableTitleLength = lableTitleLength + GeminiTitleStart
          const GeminiTitleEnd = geminiResponse.indexOf('Index')
          var Title = geminiResponse.substring(lableTitleLength, GeminiTitleEnd)
          Title = Title.replace(',', '')
          Title = Title.replace(':', '')
          Title = Title.replaceAll('"', '')
          Title = Title.trim()
          data.topic_title = Title
          console.log('kokan', Title)
        }
      }
      // index
      if (geminiResponse.includes('Index')) {
        geminiResponse = geminiResponse.replace('response: ', '')
        var lableIndexLength = 'Index'.length
        const GeminiIndexStart = geminiResponse.indexOf('Index')
        lableIndexLength = lableIndexLength + GeminiIndexStart
        const GeminiIndexEnd = geminiResponse.indexOf('startTime')
        var Index = geminiResponse.substring(lableIndexLength, GeminiIndexEnd)
        Index = Index.replace(',', '')
        Index = Index.replace(':', '')
        Index = Index.replaceAll('"', '')
        if (Index.includes('default')) {
          const regex = /^([^.]*\.){2}/
          const match = Index.match(regex)
          if (match) {
            Index = match[0]
          }
        }
        Index = Index.trim()
        console.log(Index)
      }

      // starttime
      if (geminiResponse.includes('startTime')) {
        var lableStartTimeLength = 'startTime'.length
        const GeministartTimeStart = geminiResponse.indexOf('startTime')
        lableStartTimeLength = lableStartTimeLength + GeministartTimeStart
        const GeministartTimeEnd = geminiResponse.indexOf('endTime')
        var startTime = geminiResponse.substring(lableStartTimeLength, GeministartTimeEnd)
        startTime = startTime.replace(',', '')
        startTime = startTime.replaceAll(':', '')
        startTime = startTime.replaceAll('"', '')
        startTime = startTime.trim()
      }

      // endtime
      if (geminiResponse.includes('endTime')) {
        var lableEndTimeLength = 'endTime'.length
        const GeminiendTimeStart = geminiResponse.indexOf('endTime')
        lableEndTimeLength = lableEndTimeLength + GeminiendTimeStart
        const GeminiendTimeEnd = geminiResponse.indexOf('}')
        var endTime = geminiResponse.substring(lableEndTimeLength, GeminiendTimeEnd)
        endTime = endTime.replace(',', '')
        endTime = endTime.replaceAll(':', '')
        endTime = endTime.replaceAll('"', '')
        endTime = endTime.trim()
      }
      return { Index, startTime, endTime }
    } catch (error) {
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new DataCleanUp()
