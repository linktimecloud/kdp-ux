const { t } = require(global.I18NPATH)
const ApiErrorNames = {}

ApiErrorNames.UNKNOW_ERROR = 'unknowError'
ApiErrorNames.API_INTERNAL_ERROR = 'ApiInternalError'
ApiErrorNames.PERMISSION_DENIED = 'permissionDenied'
ApiErrorNames.PARAMS_ERROR = 'paramsError'
ApiErrorNames.RECORD_NOT_EXIST = 'recordNotExist'
ApiErrorNames.SHELL_COMMAND_ERROR = 'shellCommandError'
ApiErrorNames.CREATE_PROCESS_FAILED = 'createProcessFailed'
ApiErrorNames.LOKI_DATA_ERROR = 'lokiDataError'
ApiErrorNames.JSON_PARSE_ERROR = 'jsonParseError'

const ERROR_TEMPLATE = ({
  status,
  type = 'error',
  message,
  code = -1,
  description,
  solution,
  manual,
  exception
}) => ({
  status: status || '260000',
  message,
  error: {
    app: 'BDOS PAAS',
    type,
    info: {
      code,
      description: description || message,
      solution: solution || t('error.pleaseContactSystemAdmin'),
      manual
    },
    exception
  }
})

/**
 * API error name: {status, message}
 */
const eMap = new Map()

eMap.set(
  ApiErrorNames.UNKNOW_ERROR,
  ERROR_TEMPLATE({
    code: '-1',
    message: t('error.unknown')
  })
)
eMap.set(
  ApiErrorNames.API_INTERNAL_ERROR,
  ERROR_TEMPLATE({
    code: '200000',
    message: t('error.apiInternalError')
  })
)
eMap.set(
  ApiErrorNames.PERMISSION_DENIED,
  ERROR_TEMPLATE({
    code: '210000',
    message: t('error.lackPermission'),
    solution: t('error.pleaseRequestPermission')
  })
)
eMap.set(
  ApiErrorNames.PARAMS_ERROR,
  ERROR_TEMPLATE({
    code: '220000',
    message: t('error.paramsError'),
    solution: t('error.pleaseCheckApiParams')
  })
)
eMap.set(
  ApiErrorNames.RECORD_NOT_EXIST,
  ERROR_TEMPLATE({
    status: '330000',
    code: '330000',
    message: t('error.recordNotExist'),
    solution: t('error.pleaseCheckApiParams')
  })
)
eMap.set(
  ApiErrorNames.SHELL_COMMAND_ERROR,
  ERROR_TEMPLATE({
    code: '820000',
    message: t('error.shellScriptError')
  })
)
eMap.set(
  ApiErrorNames.CREATE_PROCESS_FAILED,
  ERROR_TEMPLATE({
    code: '830000',
    message: t('error.createProcessFailed'),
    solution: t('error.pleaseResumitForm')
  })
)
eMap.set(
  ApiErrorNames.LOKI_DATA_ERROR,
  ERROR_TEMPLATE({
    code: '840000',
    message: t('error.lokiDataError'),
    solution: t('error.pleaseCheckLokiService')
  })
)
eMap.set(
  ApiErrorNames.JSON_PARSE_ERROR,
  ERROR_TEMPLATE({
    code: '850000',
    message: t('error.jsonParseError')
  })
)

// get error message by name
const getErrorInfo = (name) => {
  const defaultError = eMap.get(ApiErrorNames.UNKNOW_ERROR)
  if (!name) {
    return defaultError
  }

  return eMap.get(name) || defaultError
}

class ApiError extends Error {
  constructor (name, raw) {
    super()
    const ErrorObj = getErrorInfo(name)

    if (raw) {
      if (typeof raw === 'object') {
        ErrorObj.error.info = {
          ...ErrorObj.error.info,
          ...raw
        }
        ErrorObj.message = raw.description || ErrorObj.message
        if (raw.type) {
          ErrorObj.error.type = raw.type
        }
      } else {
        const message = raw
        ErrorObj.message = message
        if (ErrorObj && ErrorObj.info) {
          ErrorObj.info.description = message
        }
      }
    }

    this.status = ErrorObj.status
    this.error = ErrorObj.error
    this.message = ErrorObj.message
  }
}

module.exports = { ApiErrorNames, ApiError }
