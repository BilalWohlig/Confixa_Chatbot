const __constants = require("../../config/constants");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");

class Assistant {
  static assistantId = "asst_q8zK0d1tQ3pLZPjywd2BjzhC";
  static threadId = "thread_Bl7GwbN3J7h4oRdLUOgU6aIn";
  static runId = "";

  async retrieveElasticData() {
    const size = 5000;
    const client = new Client({
      node: "https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com",
      auth: {
        // username: "elastic",
        // password: "I78LJM2elK9x7HUFEKJrmMHU"
        apiKey: "dnhFNzBJMEJfME1uVlRZSVM2NmM6dXlYYXBJZFZUVUd2b1Y1bkRrS0N3dw==",
      },
    });
    const latencyIndex = ".ds-metrics-apm.transaction*";
    const traceIndex = ".ds-traces-apm-default*";
    // const profilingIndex = ".ds-profiling-events*";
    const alertIndex = ".internal.alerts-observability.*";
    const query = {
      size,
      query: {
        range: {
          "@timestamp": {
            gte: "now-1y",
            lte: "now",
          },
        },
      },
    };
    const transactions = await client.search({
      index: latencyIndex,
      body: query,
    });
    const traces = await client.search({
      index: traceIndex,
      body: query,
    });
    // const profilingData = await client.search({
    //   index: profilingIndex,
    //   body: query,
    // });
    const alerts = await client.search({
      index: alertIndex,
      body: query,
    });

    const traceHits = traces?.hits?.hits;
    const transactionsHits = transactions?.hits?.hits;
    // const profilingDataHits = profilingData?.hits?.hits
    const alertHits = alerts?.hits?.hits;

    console.log(`Found ${transactionsHits.length} transactions:`);
    console.log(`Found ${traceHits.length} traces:`);
    console.log(`Found ${alertHits.length} alerts:`);
    // console.log(`Found ${profilingDataHits.length} profilingData:`);

    fs.writeFileSync(
      "services/elasticsearch/alerts.json",
      JSON.stringify(alerts, null, 2)
    );
    // fs.writeFileSync(
    //   "services/elasticsearch/profiles.json",
    //   JSON.stringify(profilingData, null, 2)
    // );

    const transactionData = [];
    transactionsHits.forEach((hit) => {
      if (hit._source.transaction.name && !hit._source.service.target) {
        hit._source.transaction.transactionId = hit._source.transaction.id;
        hit._source.transaction.apiUrl = hit._source.transaction.name;
        hit._source.transaction.service = hit._source.service;
        transactionData.push(hit._source.transaction);
      }
      if (hit._source.span && hit._source.span.name) {
        hit._source.span.transactionId = hit._source.transaction.id;
        transactionData.push(hit._source.span);
      }
    });

    const traceData = [];
    traceHits.forEach((hit) => {
      if (hit._source.transaction.name) {
        hit._source.transaction.transactionId = hit._source.transaction.id;
        hit._source.transaction.apiUrl = hit._source.transaction.name;
        traceData.push(hit._source.transaction);
      }
      if (hit._source.span && hit._source.span.name) {
        hit._source.span.transactionId = hit._source.transaction.id;
        traceData.push(hit._source.span);
      }
    });

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
                : Number((totalDuration / (totalRequests * 1000)).toFixed(2))
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
    console.log("Latencyyyyy Doneeee");

    const formattedData = traceData.reduce((acc, item) => {
      if (item.apiUrl) {
        const { transactionId, span_count, duration } = item;
        const trace = traceData
          .filter((t) => t.transactionId === transactionId && !t.apiUrl)
          .map(({ duration, composite, destination, name, action, type }) => ({
            duration,
            composite,
            destination,
            name,
            action,
            type,
          }));
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

    const services = {};

    transactionsHits.forEach((hit) => {
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
        unit: "microseconds",
      };

      if (!services[service]) {
        services[service] = {
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

      services[service].totalServiceDuration += duration;
      services[service].totalServiceRequests += requests;
      services[service].averageServiceLatency = {
        value: Number(
          (
            services[service].totalServiceDuration /
            services[service].totalServiceRequests
          ).toFixed(2)
        ),
        unit: "microseconds",
      };
      const apiData = services[service].apiData.find(
        (api) => api.apiUrl === apiUrl
      );
      if (apiData) {
        apiData.totalApiDuration += duration;
        apiData.totalApiRequests += requests;
        apiData.averageApiLatency = {
          value: Number(
            (apiData.totalApiDuration / apiData.totalApiRequests).toFixed(2)
          ),
          unit: "microseconds",
        };
      } else {
        services[service].apiData.push({
          apiUrl,
          totalApiDuration: duration,
          totalApiRequests: requests,
          averageApiLatency,
        });
      }
    });
    fs.writeFileSync(
      "services/elasticsearch/servicesCleaned.json",
      JSON.stringify(services, null, 2)
    );
    console.log("Servicessss Doneeee");

    const serviceData = JSON.parse(
      fs.readFileSync("services/elasticsearch/servicesCleaned.json", "utf-8")
    );
    const tracesData = JSON.parse(
      fs.readFileSync("services/elasticsearch/traceCleaned.json", "utf-8")
    );
    for (const [key, value] of Object.entries(serviceData)) {
      for (let i = 0; i < value.apiData.length; i++) {
        const api = value.apiData[i];
        if (tracesData[api.apiUrl]) {
          serviceData[key].apiData[i].traceBreakdown = tracesData[api.apiUrl];
        }
      }
    }
    fs.writeFileSync(
      "services/elasticsearch/serviceLatencyTraceData.json",
      JSON.stringify(serviceData, null, 2)
    );
    console.log("Service, Latency And Trace Combinedddd");
  }

  async askQna(userQuestion) {
    try {
      await this.retrieveElasticData();
      console.log("Elastic Data Doneee");
      // if (Assistant.assistantId == "") {
      //   await this.createAssistant();
      //   console.log("Assistant Created");
      // }
      // if (Assistant.assistantId != "" && Assistant.threadId == "") {
      //   await this.createThread();
      //   console.log("Thread Created");
      // }
      // if (Assistant.assistantId != "" && Assistant.threadId != "") {
      //   await this.createMessage(userQuestion);
      //   console.log("Message Added to Thread");
      // }
      // if (
      //   Assistant.assistantId != "" &&
      //   Assistant.threadId != "" &&
      //   Assistant.runId == ""
      // ) {
      //   await this.createRun();
      //   console.log("Run Created");
      // }
      // if (Assistant.runId != "") {
      //   const status = await this.waitForRunCompletion();
      //   if (status == "completed") {
      //     Assistant.runId == "";
      //     return await this.retrieveResponse();
      //   }
      //   return "Run Not Yet Complete";
      // }
      // return "Error";
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }

  // You are a chatbot that retrieves and analyses service, latency, and trace data to answer user queries. Always call getElasticData to get all the information you need. Provide the service name, relevant API latency, trace breakdown (slowest transaction for APIs with multiple transactions) of the relevant apis, and an analysis with performance improvement steps for the apis. Format the response with the service name, API latency, trace breakdown, and analysis/recommendations based on the user's question.

  //   You are a helpful chatbot that answers user's questions accurately by checking the information provided to you throughly. The answers you provide will be detailed. For any question, provide the service name applicable, then the appropriate api based on the user's question and the api's appropriate trace breakdown. For trace breakdown, if an api has multiple transactions, then provide the breakdown of the slowest transaction of that api and always give a analysis and suggestion on how to improve the latency of that api.

  // You are a chatbot that retrieves and analyses service, transaction, and trace data to answer user queries. Always call getServiceData, getTransactionLatencyData and getTraceData to get all the information. Provide the service name, relevant API latency, trace breakdown (slowest transaction for APIs with multiple transactions), and an analysis with performance improvement steps. Format the response with the service name, API latency, trace breakdown, and analysis/recommendations based on the user's question.

    
  async createAssistant() {
    try {
      const assistant = await openai.beta.assistants.create({
        name: "Elastic Search Assistant",
        description: `You are a chatbot that retrieves and analyses service, transaction, and trace data to answer user queries. Always call getServiceData, getTransactionLatencyData and getTraceData to get all the information. Provide the service name, relevant API latency, trace breakdown (slowest transaction for APIs with multiple transactions), and an analysis with performance improvement steps. Format the response with the service name, API latency, trace breakdown, and analysis/recommendations based on the user's question.`,
        model: "gpt-4-turbo-preview",
        tools: [
          {
            type: "function",
            function: {
              name: "getServiceData",
              description:
                "Get the data like average latency of a service, the data of the apis associated with that service, etc.",
              //   parameters: {
              //     type: "object",
              //     properties: {
              //       location: {
              //         type: "string",
              //         description: "The city and state e.g. San Francisco, CA",
              //       },
              //       unit: { type: "string", enum: ["c", "f"] },
              //     },
              //     required: ["location"],
              //   },
            },
          },
          {
            type: "function",
            function: {
              name: "getTransactionLatencyData",
              description: "Get the data like average latency of an api.",
              //   parameters: {
              //     type: "object",
              //     properties: {
              //       location: {
              //         type: "string",
              //         description: "The city and state e.g. San Francisco, CA",
              //       },
              //       unit: { type: "string", enum: ["c", "f"] },
              //     },
              //     required: ["location"],
              //   },
            },
          },
          {
            type: "function",
            function: {
              name: "getTraceData",
              description:
                "Get the traces of an api which includes their internal working as well.",
              //   parameters: {
              //     type: "object",
              //     properties: {
              //       location: {
              //         type: "string",
              //         description: "The city and state e.g. San Francisco, CA",
              //       },
              //       unit: { type: "string", enum: ["c", "f"] },
              //     },
              //     required: ["location"],
              //   },
            },
          },
        ],
      });
      Assistant.assistantId = assistant.id;
      console.log(Assistant.assistantId);
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
  async getElasticData() {
    const elasticData = JSON.parse(
      fs.readFileSync(
        "services/elasticsearch/serviceLatencyTraceData.json",
        "utf8"
      )
    );
    return elasticData;
  }
  async getServiceData() {
    const serviceData = JSON.parse(
      fs.readFileSync("services/elasticsearch/servicesCleaned.json", "utf8")
    );
    return serviceData;
  }
  async getTransactionLatencyData() {
    const transactionData = JSON.parse(
      fs.readFileSync("services/elasticsearch/latencies.json", "utf8")
    );
    return transactionData;
  }
  async getTraceData() {
    const traceData = JSON.parse(
      fs.readFileSync("services/elasticsearch/traceCleaned.json", "utf8")
    );
    return traceData;
  }
  async createThread() {
    try {
      const thread = await openai.beta.threads.create();
      Assistant.threadId = thread.id;
      console.log(Assistant.threadId);
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
  async createMessage(userQuestion) {
    try {
      //   const latencyFile = await openai.files.create({
      //     file: fs.createReadStream("services/elasticsearch/latencies.json"),
      //     purpose: "assistants",
      //   });
      //   const tracesFile = await openai.files.create({
      //     file: fs.createReadStream("services/elasticsearch/traceCleaned.json"),
      //     purpose: "assistants",
      //   });
      //   const servicesFile = await openai.files.create({
      //     file: fs.createReadStream(
      //       "services/elasticsearch/servicesCleaned.json"
      //     ),
      //     purpose: "assistants",
      //   });
      const message = await openai.beta.threads.messages.create(
        Assistant.threadId,
        {
          // thread_id: Assistant.threadId,
          role: "user",
          content: userQuestion,
          //   file_ids: [latencyFile.id, tracesFile.id, servicesFile.id],
        }
      );
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
  async createRun() {
    try {
      const run = await openai.beta.threads.runs.create(Assistant.threadId, {
        // thread_id: Assistant.threadId,
        assistant_id: Assistant.assistantId,
        instructions: "You are a chatbot that retrieves and analyses service, transaction, and trace data to answer user queries. Always call getServiceData, getTransactionLatencyData and getTraceData to get all the information. Provide the service name, relevant API latency, trace breakdown, and an analysis with performance improvement steps. Format the response with the service name, API latency, trace breakdown, and analysis/recommendations based on the user's question."
      });
      Assistant.runId = run.id;
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
  async waitForRunCompletion() {
    try {
      let runStatus = {
        status: "default",
      };
      while (runStatus.status != "completed") {
        runStatus = await openai.beta.threads.runs.retrieve(
          Assistant.threadId,
          Assistant.runId
        );
        console.log(runStatus.status);
        if (runStatus.status == "requires_action") {
          const requiredActions =
            runStatus.required_action.submit_tool_outputs.tool_calls;
          console.log(requiredActions);
          const toolsOutput = [];
          for (let action of requiredActions) {
            const funcName = action.function.name;
            // if (funcName == "getElasticData") {
            //   const elasticData = await this.getElasticData();
            //   toolsOutput.push({
            //     tool_call_id: action.id,
            //     output: JSON.stringify(elasticData),
            //   });
            // }
            if (funcName === "getServiceData") {
              const serviceData = await this.getServiceData();
              toolsOutput.push({
                tool_call_id: action.id,
                output: JSON.stringify(serviceData),
              });
            } else if (funcName === "getTransactionLatencyData") {
              const transactionData = await this.getTransactionLatencyData();
              toolsOutput.push({
                tool_call_id: action.id,
                output: JSON.stringify(transactionData),
              });
            } else if (funcName === "getTraceData") {
              const traceData = await this.getTraceData();
              toolsOutput.push({
                tool_call_id: action.id,
                output: JSON.stringify(traceData),
              });
            }
            else {
              console.log("Unknown Function");
            }
          }
          await openai.beta.threads.runs.submitToolOutputs(
            Assistant.threadId,
            Assistant.runId,
            { tool_outputs: toolsOutput }
          );
        }
        await this.sleep(1000);
      }
      return runStatus.status;
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
  async retrieveResponse() {
    try {
      const threadMessages = await openai.beta.threads.messages.list(
        Assistant.threadId
      );
      const messages = threadMessages.data;
      console.log(messages[0].content[0].text.value);
      return messages[0].content[0].text.value;
    } catch (error) {
      console.log(error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = new Assistant();
