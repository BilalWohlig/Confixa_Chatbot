const APP_NAME = 'framework'
const DB_NAME = 'framework'
const CUSTOM_CONSTANT = {
  DEV_ENV: 'development',
  PROD_ENV: 'production',
  UAT_ENV: 'uat',
  STAG_ENV: 'staging'
}
const PUBLIC_FOLDER_PATH = process.env.PWD + '/public'
const SERVER_TIMEOUT = 20 * 60 * 1000
const VALIDATION = 'validation'
const VALIDATOR = {
  email:
    '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
  password:
    '^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,}$',
  text: '^[a-zA-Z][a-zA-Z ]+$',
  name: /^[a-zA-Z\s]+$/,
  number: '^[0-9]+$',
  aplphaNumeric: '^[a-zA-Z0-9]+$',
  phoneNumber: '^\\d{1,10}$',
  postalCode: '^\\d{1,6}$',
  phoneCode: '^\\d{1,2}$',
  timeStamp:
    '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$',
  aplphaNumericWithUnderscore: '^[a-z0-9_]+$',
  fileExtType: /^(jpg|jpeg|png)$/,
  url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  noTabLinebreakSpace: /^(?:(.)(?!\s\s\s\s)(?!\n)(?!\t))*$/g,
  noWhiteSpace: '^[a-zA-Z0-9_]*$',
  phoneNumberWithPhoneCode: '^[\\d+]{1}[0-9]{2}?[0-9]{10}$',
  phoneNumberE164: '^([\\d+]{1})?[0-9]{7,15}$', // e.164 format with min 7 & max 15 with + optional
  aplphaNumericWithUnderscoreAndHyphen: '^[a-zA-Z0-9_-]+$',
  date: '^\\d{4}-\\d{2}-\\d{2}$',
  file: {
    image: {
      pattern: /^(jpg|jpeg|png)$/,
      maxUploadSize: 5 * 1024 * 1024 // 5mb
    }
  }
}

const SESSION_TIME_OUT = 20 * 60 * 1000
const REDIS_EXPIRY_TIME = 3600
const SALT_ROUNDS = 8
const EXPIRY_OF_CACHE = 300
const USER_ACTIVITY_LOGS = 'useractivitylogs'
const V1 = 'v1'
const ARRAY_OF_MEDIUM = ['body', 'params', 'query']
const AUTH_URL = 'https://login.microsoftonline.com/'
const OAUTH2_ENDPOINT = 'oauth2/v2.0/token'
const EMBED_ENDPOINT = 'myorg/GenerateToken'
const JWT_EXPIRY_TIME = 10800

const GITHUB_BASE_URL = 'https://api.github.com'
const GITHUB_USER = 'Vaishnavi20011225'
const GITHUB_REPO = 'confixaaaa-backend'
const GITHUB_FILENAME = 'file102'
const GITHUB_ACTIONS_FILEPATH = '.github/workflows/github_actions.yaml'
const GITHUB_FILE_TO_EDIT = 'ss.txt'
const TOKEN = 'token'
const GITHUB_ORG = 'confixa'
const GITOPS_REPO = 'gitops'
const GITOPS_BRANCH = 'gitops-branch'

const ARGOCD_BASE_URL = 'https://argocd.'
const ARGOCD_BASE2_URL = '/api/v1/'
const ARGO_BEARER = 'Bearer'

const ELASTICSEARCH_NODE = 'https://433e629050d947eeb3563b2663c35bfc.ap-south-1.aws.elastic-cloud.com'
const ELASTICSEARCH_API_KEY = 'dnhFNzBJMEJfME1uVlRZSVM2NmM6dXlYYXBJZFZUVUd2b1Y1bkRrS0N3dw=='
const ELASTICSEARCH_SIZE = 100
const TOPIC_TITLE = 'New Chat'

module.exports.JWT_EXPIRY_TIME = JWT_EXPIRY_TIME
module.exports.EMBED_ENDPOINT = EMBED_ENDPOINT
module.exports.OAUTH2_ENDPOINT = OAUTH2_ENDPOINT
module.exports.AUTH_URL = AUTH_URL
module.exports.RESPONSE_MESSAGES = require('../responses/api-responses')
module.exports.CUSTOM_CONSTANT = CUSTOM_CONSTANT
module.exports.PUBLIC_FOLDER_PATH = PUBLIC_FOLDER_PATH
module.exports.APP_NAME = APP_NAME
module.exports.DB_NAME = DB_NAME
module.exports.SERVER_TIMEOUT = SERVER_TIMEOUT
module.exports.VALIDATION = VALIDATION
module.exports.VALIDATOR = VALIDATOR
module.exports.SESSION_TIME_OUT = SESSION_TIME_OUT
module.exports.REDIS_EXPIRY_TIME = REDIS_EXPIRY_TIME
module.exports.SALT_ROUNDS = SALT_ROUNDS
module.exports.EXPIRY_OF_CACHE = EXPIRY_OF_CACHE
module.exports.USER_ACTIVITY_LOGS = USER_ACTIVITY_LOGS
module.exports.V1 = V1
module.exports.ARRAY_OF_MEDIUM = ARRAY_OF_MEDIUM

module.exports.GITHUB_BASE_URL = GITHUB_BASE_URL
module.exports.GITHUB_USER = GITHUB_USER
module.exports.GITHUB_REPO = GITHUB_REPO
module.exports.GITHUB_FILENAME = GITHUB_FILENAME
module.exports.GITHUB_ACTIONS_FILEPATH = GITHUB_ACTIONS_FILEPATH
module.exports.GITHUB_FILE_TO_EDIT = GITHUB_FILE_TO_EDIT
module.exports.TOKEN = TOKEN
module.exports.GITHUB_ORG = GITHUB_ORG
module.exports.GITOPS_REPO = GITOPS_REPO
module.exports.GITOPS_BRANCH = GITOPS_BRANCH

module.exports.ARGOCD_BASE_URL = ARGOCD_BASE_URL
module.exports.ARGOCD_BASE2_URL = ARGOCD_BASE2_URL
module.exports.ARGO_BEARER = ARGO_BEARER

module.exports.ELASTICSEARCH_NODE = ELASTICSEARCH_NODE
module.exports.ELASTICSEARCH_API_KEY = ELASTICSEARCH_API_KEY
module.exports.ELASTICSEARCH_SIZE = ELASTICSEARCH_SIZE
module.exports.TOPIC_TITLE = TOPIC_TITLE
