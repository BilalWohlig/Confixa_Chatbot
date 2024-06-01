const __constants = require("../../config/constants");
const textSplitter = require("langchain/text_splitter");
// const scrapper = require("langchain/document_loaders/web/cheerio");
const memory = require("langchain/vectorstores/memory");
const openai = require("@langchain/openai");
const retrieverDoc = require("langchain/tools/retriever");
const openaiAgent = require("langchain/agents");
const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
// const prompts = require("@langchain/core/prompts");
const { ChatMessageHistory } = require("langchain/stores/message/in_memory");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const { Document } = require("langchain/document");
const { BufferMemory } = require("langchain/memory");

// const { ChatPromptTemplate } = require("@langchain/core/prompts");
// const hub = require("langchain/hub");
const { pull } = require("langchain/hub");
const { DynamicTool } = require("@langchain/core/tools");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts");
const { convertToOpenAIFunction } = require("@langchain/core/utils/function_calling");
const { AIMessage, BaseMessage, HumanMessage } = require("@langchain/core/messages");
const { RunnableSequence } = require("@langchain/core/runnables");
const { AgentExecutor } = require("langchain/agents");

const { formatToOpenAIFunctionMessages } = require("langchain/agents/format_scratchpad");
const { OpenAIFunctionsAgentOutputParser } = require("langchain/agents/openai/output_parser");


class Langchain {
  static actualAgent = ''
  /** @type {Array<BaseMessage>} */
  static chatHistory = [];
  // static memory = new BufferMemory({
  //   returnMessages: true,
  //   inputKey: "input",
  //   outputKey: "output",
  //   memoryKey: "history",
  // });
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
    const errorIndex = ".ds-logs-apm.error-default*";
    const latencyIndex = ".ds-metrics-apm.transaction*";
    const traceIndex = ".ds-traces-apm-default*";
    const query = {
      size,
      query: {
        range: {
          "@timestamp": {
            gte: "now-1d/d",
            lte: "now/d",
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

    const errors = await client.search({
      index: errorIndex,
      body: query,
    })


    const traceHits = traces?.hits?.hits;
    const transactionsHits = transactions?.hits?.hits;
    const errorsHits = errors?.hits?.hits
    console.log(`Found ${transactionsHits.length} transactions:`);
    console.log(`Found ${traceHits.length} traces:`);
    console.log(`Found ${errorsHits.length} errors`)


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

    fs.writeFileSync(
      "services/elasticsearch/rawErrors.json",
      JSON.stringify(errorsHits, null, 2)
    );
    console.log("Errorrssss Written");

     // const errorData = [];
    // errorsHits.forEach((hit) => {
      // if (hit._source.transaction.name) {
      //   hit._source.transaction.transactionId = hit._source.transaction.id;
      //   hit._source.transaction.apiUrl = hit._source.transaction.name;
      //   traceData.push(hit._source.transaction);
      // }
      // if (hit._source.span && hit._source.span.name) {
      //   hit._source.span.transactionId = hit._source.transaction.id;
      //   traceData.push(hit._source.span);
      // }
    // })




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

    const errorData = JSON.parse(
      fs.readFileSync("services/elasticsearch/rawErrors.json", "utf-8")
    )

    const dataArray = Array.isArray(errorData) ? errorData : [errorData];

    const errorsService = {};

    dataArray.forEach((hit) => {
      const serviceName = hit._source.service.name
      const kubernetes = hit._source.kubernetes
      const errorObj = hit._source.error
      const msg = hit._source.message
      const url = hit._source.url
      const service = hit._source.service
      const transaction = hit._source.transaction
      const timestamp = hit._source.timestamp
  
      if (!errorsService[serviceName]) {
        errorsService[serviceName] = {
              kubernetes,
              errorObj,
              msg,
              url,
              service,
              transaction,
              timestamp
          }
        }
  }
  )

  fs.writeFileSync(
    "services/elasticsearch/errorsCleaned.json",
    JSON.stringify(errorsService, null, 2)
  )

    


  const client2 = new Client({
      node: 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com',
      auth: {
        // username: "elastic",
        // password: "I78LJM2elK9x7HUFEKJrmMHU"
        apiKey: 'dnhFNzBJMEJfME1uVlRZSVM2NmM6dXlYYXBJZFZUVUd2b1Y1bkRrS0N3dw=='
      }
    })
    const healthData = await client2.healthReport()
    // console.log("healthdataaaaaaa", healthData)
    fs.writeFileSync(
      "services/elasticsearch/healthData.json",
      JSON.stringify(healthData, null, 2)
    )
  }



  // async createRetriever() {
  //   try {
  //     // const loader = new scrapper.CheerioWebBaseLoader(
  //     //   "https://docs.smith.langchain.com/user_guide"
  //     // );
  //     // const rawDocs = await loader.load();

  //     const splitter = new textSplitter.RecursiveCharacterTextSplitter({
  //       chunkSize: 1000,
  //       chunkOverlap: 200,
  //     });
  //     const elasticData = 
  //       fs.readFileSync("services/elasticsearch/latencies.json", "utf-8")
  //     ;
  //     const docs = await splitter.splitDocuments([
  //       new Document({ pageContent: elasticData }),
  //     ]);

  //     const vectorstore = await memory.MemoryVectorStore.fromDocuments(
  //       docs,
  //       new openai.OpenAIEmbeddings()
  //     );
  //     const retriever = vectorstore.asRetriever();

  //     // const retrieverResult = await retriever.getRelevantDocuments(
  //     //   "What is my slowest api"
  //     // );
  //     // console.log(retrieverResult);

  //     const retrieverTool = retrieverDoc.createRetrieverTool(retriever, {
  //       name: "elastic_data_bot",
  //       description:
  //         "You are a chatbot that retrieves and analyses service, latency, and trace data to answer user queries. Provide the service name, relevant API latency, trace breakdown (slowest transaction for APIs with multiple transactions) of the relevant apis, and an analysis with performance improvement steps for the apis. Format the response with the service name, API latency, trace breakdown, and analysis/recommendations based on the user's question.",
  //     });
  //     const tools = [retrieverTool];
  //     return tools;
  //   } catch (error) {
  //     console.log(error);
  //     return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
  //   }
  // }


  async createTools() {
    const latencyTransactionTool = new DynamicTool({
      name: "getLatencyTransactionData",
      description: "Returns the data like average latency of an api. Input should be an empty string.",
      func: async (input) => {
        try{
          console.log('Latencyyyy', input);
          // console.log('Hehehehhehe')
          const transactionData = 
            fs.readFileSync("services/elasticsearch/latencies.json", "utf8")
          ;
          return transactionData;
        } catch (error) {
          return error.message
        }
      },
    });
    const traceTool = new DynamicTool({
      name: "getTraceData",
      description: "Returns the traces of an api which includes their internal working as well. Input should be an empty string.",
      func: async (input) => {
        try {
          console.log('Traceeee', input)
          const traceData = 
            fs.readFileSync("services/elasticsearch/traceCleaned.json", "utf8")
          ;
          return traceData;
        } catch (error) {
          return error.message
        }
      },
    });
    const serviceTool = new DynamicTool({
      name: "getServiceData",
      description: "Returns the data like average latency of a service, the data of the apis associated with that service, etc. Input should be an empty string.",
      func: async (input) => {
        try {
          console.log("Serviceeee", input)
          const serviceData = 
            fs.readFileSync("services/elasticsearch/servicesCleaned.json", "utf8")
          ;
          return serviceData;
        } catch (error) {
          return error.message
        }
      },
    });

    const clusterHealthCheckTool = new DynamicTool({
      name: "getClusterHealthCheck",
      description: "Returns the data like health state of the cluster. Input should be an empty string.",
      func: async (input) => {
        try{
          console.log('Cluster HealthCheck', input);
          const healthData = 
            fs.readFileSync("services/elasticsearch/healthData.json", "utf8")
          ;
          return healthData;
        } catch (error) {
          return error.message
        }
      },
    });

    const errorsTool = new DynamicTool({
      name: "getErrorsData",
      description: "Returns the data like errors and logs of the errors,location of error and cause of error the data of the apis associated with that error, they are classified to which service it belongs to, etc. Input should be an empty string.",
      func: async (input) => {
        try {
          console.log("Errors", input)
          const errorData = 
            fs.readFileSync("services/elasticsearch/errorsCleaned.json", "utf8")
          ;
          return errorData;
        } catch (error) {
          return error.message
        }
      },
    });


    const tools = [latencyTransactionTool, traceTool, serviceTool, errorsTool, clusterHealthCheckTool]
    // const tools = [customTool, customTool2]
    return tools
  }

  async createAgent(tools) {
    const llm = new openai.ChatOpenAI({
      modelName: "gpt-4-0125-preview",
      temperature: 0,
    });
    const modelWithFunctions = llm.bind({
      functions: tools.map((tool) => convertToOpenAIFunction(tool)),
    });
    // console.log("MODELLLLLL", modelWithFunctions.kwargs.functions[0].parameters)
    const MEMORY_KEY = "chat_history"
    // const prompt = ChatPromptTemplate.fromMessages([
    //   ["system", "You are a very powerful chatbot assistant that retrieves and analyses service, transaction, and trace data to answer user queries. Always call getServiceData, getLatencyTransactionData and getTraceData to get all the information."],
    //   new MessagesPlaceholder(MEMORY_KEY),
    //   ["user", "{input}. Use the information you receive to provide the service name, relevant API latency, trace breakdown (slowest transaction for APIs with multiple transactions), and an analysis with performance improvement steps. Format the response with the service name, API latency, trace breakdown, and analysis/recommendations based on the user's question."],
    //   new MessagesPlaceholder("agent_scratchpad"),
    // ]);
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a very powerful chatbot assistant that retrieves and analyses service, transaction, and trace data and error logs and health of the cluster to answer user queries. Always call getServiceData, getLatencyTransactionData and getTraceData , getErrorsData, getClusterHealthCheck to get all the information."],
      new MessagesPlaceholder(MEMORY_KEY),
      ["user", "{input}. Use the information you receive to provide an appropriate response to the user's questions. Also in the end, provide an analysis with performance improvement steps. For each analysis and improvement step, give a probable cause and it's appropriate steps for improvement. If provided error data, give detailed analysis with performance improvement steps for each error. "],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);
    
    const agentWithMemory = RunnableSequence.from([
      {
        input: (i) => i.input,
        agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
        chat_history: (i) => i.chat_history,
        // memory: () => Langchain.memory.loadMemoryVariables({}),
      },
      // {
      //   input: (previousOutput) => previousOutput.input,
      //   history: (previousOutput) => previousOutput.memory.history,
      // },
      prompt,
      modelWithFunctions,
      new OpenAIFunctionsAgentOutputParser(),
    ]);
    // console.log("Agenttttt", agentWithMemory)
    /** Pass the runnable along with the tools to create the Agent Executor */
    const executorWithMemory = AgentExecutor.fromAgentAndTools({
      agent: agentWithMemory,
      tools,
      // returnIntermediateSteps: true,
      // maxIterations: 1,
    });
    if(Langchain.actualAgent == '') {

        Langchain.actualAgent = executorWithMemory
      }
    return executorWithMemory;
  }
  async runAgent(agent, userQuestion) {
    try {
      const inputs = {
        input: userQuestion,
        chat_history: Langchain.chatHistory,
      }
      const result = await agent.invoke(inputs);
      // console.log("Resulttttt", result)
      // console.log("Actionnnn", result.intermediateSteps[0].action)
      // console.log("Observationnnn", result.intermediateSteps[0].observation)
      // const result = await agent.invoke(
      //   {
      //     input: userQuestion,
      //     chat_history: Langchain.chatHistory,
      //   },
      // );
      Langchain.chatHistory.push(new HumanMessage(userQuestion));
      Langchain.chatHistory.push(new AIMessage(result.output));
      // await Langchain.memory.saveContext(inputs, {
      //   output: result.content,
      // })
      return result;

    } catch (error) {
      console.log("540",error) 
    }
  }
  async askQna(userQuestion) {
    try {
      await this.retrieveElasticData();
      console.log("Elastic Doneeeee");
      // const toolsData = await this.createRetriever();
      // console.log("Retriever Createddd");
      if(Langchain.actualAgent == '') {
        const toolsData = await this.createTools()
        // console.log("Tools Createddd", toolsData);
        const agent = await this.createAgent(toolsData);
        // console.log("Agent Createddddd", agent);
      }
      // console.log('item', Langchain.actualAgent)
      const runningAgent = await this.runAgent(Langchain.actualAgent, userQuestion);
      // console.log("lalalala", runningAgent)
      console.log("answer", runningAgent.output)
      return runningAgent;
    } catch (error) {
      console.log("error ocurred", error);
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER;
    }
  }
}

module.exports = new Langchain();
