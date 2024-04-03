export default {
  resource: 'Resource',
  node: 'Node',
  workflow: 'Resource',
  nodeLog: '@:trms.node@:common.logs',
  validation: {
    invalidNode: 'Please reselect the node, which is not within the current resource',
    emptyFilter: 'Please select {type}',
    invalidTime: 'Please select valid start time and end time',
    invalidRange: 'Timerange is invalid, start time must before end time'
  },
  viewLogs: 'View logs'
}
