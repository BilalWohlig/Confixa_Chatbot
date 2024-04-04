const __constants = require("../../config/constants");
const { getindex } = require("../../services/elasticsearch/getindexes");
const { getGeminiResponse } = require("../elasticsearch/gemini");
const { getClaudeResponse } = require("../elasticsearch/claude");
const { getGPTResponse } = require("./gptIndex");
const { cleanResponse } = require("../elasticsearch/datacleanup");
const { getresponse } = require("../elasticsearch/getresponses");
const { getGeminiResponse2 } = require("../elasticsearch/gemini2");
const { getGPTResponse2 } = require("./gptQnA");
const { getGPTResponseForApi } = require("./gptForApi");
const { cleanServices } = require("./cleanServiceSummary");
const { cleanedServiceTransactions } = require("./cleanServiceTransactions");
const { verify } = require("../elasticsearch/verifyGemini");
const fs = require("fs");
const moment = require("moment");
class GetBotResponse {
  async getBotResponse(data) {
    try {
      // Get indexes
      const indexes = await getindex(data);
      if (!indexes) {
        return __constants.RESPONSE_MESSAGES.FAILED;
      }

      // var geminiResponse = await getGeminiResponse(indexes, data)

      var gptResponse = await getGPTResponse(data);

      console.log("Response from GPT", gptResponse);

      // const claudeResponse = await getClaudeResponse()

      // return claudeResponse

      // console.log("before parse", geminiResponse)
      if (typeof gptResponse !== "object") {
        var gptResponseJSON = JSON.parse(gptResponse);
      }
      // // const geminiResponseJSON = JSON.parse(geminiResponse)
      console.log("GPTTTT", gptResponseJSON);
      if (gptResponse.status_code) {
        return __constants.RESPONSE_MESSAGES.FAILED;
      }
      // // const cleanedResponse = await cleanResponse(geminiResponse, data)
      // // console.log('cleanResponse', cleanedResponse)
      if (!gptResponseJSON.Index) {
        return __constants.RESPONSE_MESSAGES.BOT;
      }
      const cleanedResponse = {
        Index: gptResponseJSON.Index,
        startTime: gptResponseJSON.startTime,
        endTime: gptResponseJSON.endTime,
        category: gptResponseJSON.category,
      };

      const verifiedResponse = await verify(cleanedResponse);
      if (verifiedResponse.status_code) {
        return verifiedResponse;
      }
      if (
        verifiedResponse.startTime == null ||
        isNaN(verifiedResponse.startTime)
      ) {
        verifiedResponse.startTime = 0;
      }
      if (verifiedResponse.endTime == null || isNaN(verifiedResponse.endTime)) {
        verifiedResponse.endTime = Date.now();
      }
      console.log("verify", verifiedResponse);

      const txns = await getresponse(gptResponseJSON, verifiedResponse);
      if (txns !== true) {
        // const resp = __constants.RESPONSE_MESSAGES.FAILED
        // return [txns, resp]
        return txns;
      }
      if (verifiedResponse.category === "services") {
        const transactionData = JSON.parse(
          fs.readFileSync(
            "services/elasticsearch/fullTransactions.json",
            "utf8"
          )
        );
        const result = {};

        transactionData.forEach((hit) => {
          const service = hit._source.service.name;
          const environment = hit._source.service.environment;
          const language = hit._source.service.language;
          const node = hit._source.service.node;
          const runtime = hit._source.service.runtime;
          const version = hit._source.service.version;
          const apiUrl = hit._source.transaction.apiUrl;
          const duration = hit._source.transaction.duration.summary.sum;
          const requests = hit._source.transaction.duration.summary.value_count;
          const averageApiLatency = {
            value: duration / requests,
            unit: 'microseconds'
          }

          if (!result[service]) {
            result[service] = {
              totalServiceDuration: 0,
              totalServiceRequests: 0,
              averageServiceLatency: 0,
              environment,
              language,
              node,
              runtime,
              version,
              apiData: [],
            };
          }

          result[service].totalServiceDuration += duration;
          result[service].totalServiceRequests += requests;
          result[service].averageServiceLatency = {
            value: Number(
              (
                result[service].totalServiceDuration /
                (result[service].totalServiceRequests)
              ).toFixed(2)
            ),
            unit: 'microseconds'  
          }
          const apiData = result[service].apiData.find(
            (api) => api.apiUrl === apiUrl
          );
          if (apiData) {
            apiData.totalApiDuration += duration;
            apiData.totalApiRequests += requests;
            apiData.averageApiLatency = {
              value: Number(
                (
                  apiData.totalApiDuration /
                  (apiData.totalApiRequests)
                ).toFixed(2)
              ),
              unit: 'microseconds'
            }
          } else {
            result[service].apiData.push({
              apiUrl,
              totalApiDuration: duration,
              totalApiRequests: requests,
              averageApiLatency,
            });
          }
        });
        fs.writeFileSync(
          "services/elasticsearch/servicesCleaned.json",
          JSON.stringify(result, null, 2)
        );
        console.log("Servicessss Doneeee");
      } else if (verifiedResponse.category === "latency") {
        const transactionData = JSON.parse(
          fs.readFileSync("services/elasticsearch/transactions.json", "utf8")
        );
        const groupedData = transactionData.reduce((acc, curr) => {
          const { name } = curr;
          const { sum, value_count } = curr.duration.summary;
          const { environment, language, runtime, version } = curr.service;
          const serviceName = curr.service.name;
          const serviceObj = {
            name: serviceName,
            environment,
            language,
            runtime,
            version,
          };

          if (!acc[name]) {
            acc[name] = {
              totalDuration: 0,
              totalRequests: 0,
              service: serviceObj,
            };
          }

          acc[name].totalDuration += sum;
          acc[name].totalRequests += value_count;

          return acc;
        }, {});

        // Calculate the average sum per value_count for each name
        const result = Object.entries(groupedData).reduce(
          (acc, [name, { totalDuration, totalRequests, service }]) => {
            acc[name] = {
              totalDuration,
              totalRequests,
              averageLatency:
                totalRequests > 0
                  ? totalDuration / (totalRequests * 1000) > 10
                    ? Math.round(totalDuration / (totalRequests * 1000))
                    : Number(
                        (totalDuration / (totalRequests * 1000)).toFixed(2)
                      )
                  : 0,
              service,
            };
            return acc;
          },
          {}
        );
        fs.writeFileSync(
          "services/elasticsearch/latencies.json",
          JSON.stringify(result, null, 2)
        );
        console.log("Latencyyyyy Doneeee")
      }
      const tracesData = JSON.parse(
        fs.readFileSync("services/elasticsearch/traces.json", "utf8")
      );
      const formattedData = tracesData.reduce((acc, item) => {
        if (item.apiUrl) {
          const { transactionId, span_count, duration } = item;
          const trace = tracesData
            .filter((t) => t.transactionId === transactionId && !t.apiUrl)
            .map(
              ({ duration, composite, destination, name, action, type }) => ({
                duration,
                composite,
                destination,
                name,
                action,
                type,
              })
            );
          // console.log("This is traceeeeee", trace)
          acc[item.apiUrl] = acc[item.apiUrl] || [];
          acc[item.apiUrl].push({
            transactionId,
            span_count,
            totalDuration: duration,
            trace,
          });
        }
        return acc;
      }, {});
      fs.writeFileSync(
        "services/elasticsearch/traceCleaned.json",
        JSON.stringify(formattedData, null, 2)
      );
      console.log("Tracessssss Doneeee");
      let apis = "";
      if (verifiedResponse.category == "latency") {
        apis = await getGPTResponseForApi(data);
      }
      const GPTResponse2 = await getGPTResponse2(
        data,
        apis,
        verifiedResponse.category
      );
      console.log("GPTResponse2", GPTResponse2);
      if (GPTResponse2.status_code) {
        return gptResponse;
      }
      return GPTResponse2;
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
}

module.exports = new GetBotResponse();
