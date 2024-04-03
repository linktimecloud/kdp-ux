const { ApiErrorNames, ApiError } = require(global.UTILPATH + 'error')
const { Process } = require(global.MODELPATH)

const checkProcessExist = async ({ ctx, pid }) => {
  const pro = await Process.findOne({ where: { pid } })
  if (!pro) {
    throw new ApiError(ApiErrorNames.RECORD_NOT_EXIST, {
      description: ctx.t('error.processNotExist'),
      solution: ctx.t('error.pleaseCheckProcessId')
    })
  }
  return pro
}

module.exports = {
  checkProcessExist
}
