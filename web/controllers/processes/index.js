// logs actions
module.exports = {
  getProcesses: require('./action/processes').processes,
  getProcessById: require('./action/process').get,
  putProcessById: require('./action/process').put,
  createProcess: require('./action/process').create,
  updateStatus: require('./action/process').updateStatus
}
