export default {
  license: 'License',
  licenseInfo: '@:cluster.license Infomations',
  licenseUpdate: 'Update @:cluster.license',
  licenseUpdateSuccess: 'Updated @:cluster.license!',
  licenseExpired: '@:cluster.license is expired, please update!',
  versionType: 'Cluster Version Type',
  id: 'Cluster ID',
  owner: 'Owner',
  allowedApps: 'Cluster Allowed Apps',
  allowedSize: 'Cluster Allowed Size',
  issuedAt: 'Issued Time',
  expiredAt: 'Expired Time',
  nodeConfig: 'Node config',
  hostLabel: 'Select host',
  general: 'General',
  clusterName: 'Cluster name',
  agentNumber: 'Agent number',
  description: 'Description',
  settings: 'Cluster settings',
  summary: 'Cluster Summary',
  modules: 'Cluster Modules',
  applications: 'Installed applications',
  runningEmpty: 'The current user has no running applications',
  nodeInfo: 'Nodes information',
  addNode: 'Add node',
  sumNode: 'Add node',
  removeNode: 'remove node',
  hostName: 'Host name',
  hostIp: 'Host IP',
  publicIp: 'Public @:cluster.hostIp',
  additionalHost: 'Additional host',
  additionalHostPublicIPTip: 'If the public network host IP is not filled in, the host IP will be used instead',
  repeatHostNameWarning: 'There are Repeated hostname, you should modify it before you resubmit it',
  repeatHostIpWarning: 'There are Repeated hostIP, you should modify it before you resubmit it',
  someDataNullWarning: 'The information is not full, you should modify it before you resubmit it',
  subAgentNumber: 'Agent number',
  total: 'Total',
  unused: 'Unused',
  toNodes: 'Click to view node details',
  noChanges: 'No changes are detected, please change the configuration before submitting',
  settingsDiff: 'Cluster configuration change',
  viewDiff: 'View changes',
  updateSettingsTips: 'Are you sure you want to change the system configuration? Please be careful, improper modifications can cause massive irreparable damage to the system!',
  nodeManage: {
    type: 'Management type',
    add: 'Management type',
    scale: 'Batch node management'
  },
  iaasNodes: {
    titleAdd: 'Add resource stack node',
    titleAdded: 'Added resource stack',
    add: 'Add resource stack',
    remove: 'Remove resource stack',
    stackStatus: 'Resource stack status',
    stackName: 'Resource stack name',
    region: 'Region',
    instanceNum: 'Nodes',
    accessKeyID: 'Access Key ID',
    accessKeySecret: 'Access Key Secret',
    CREATE_COMPLETE: 'Resource stack addition completed',
    CREATE_IN_PROGRESS: 'Adding resource stack',
    accessKeyEmpty: 'Please fill in the complete Access Key ID/Secret',
    scaleDown: 'After deleting the resource stack, all nodes added through the resource stack will be deleted at the same time. Are you sure to delete ?',
    scaleProcessing: 'The resource stack is being adjusted...'
  },
  from: {
    aliyun: 'From Alibaba Cloud',
    aws: 'From AWS'
  },
  node: 'Node',
  NetworkUnavailable: 'Network configuration',
  MemoryPressure: 'Memory Pressure',
  DiskPressure: 'Disk Pressure',
  PIDPressure: 'PID Pressure',
  Ready: 'Health status',
  SchedulingDisabled: 'Scheduling status',
  masterNode: 'Master Node',
  workerNode: 'Worker Node',
  editLabels: 'Edit Labels',
  addLabels: 'Add Labels',
  labelNotUniq: 'Duplicate label name',
  labelKey: 'Label Key',
  labelValue: 'Label Value',
  unknown: 'Unknown',
  label: 'Label',
  labelInfo: 'Label Info',
  true: 'True',
  false: 'False',
  nodeDisabled: 'Disabled',
  nodeStop: 'Stop',
  nodeDrain: 'Drain',
  nodeEnable: 'Enable',
  nodeDisabledText: 'Do you want to set the node to the unschedulable state and prevent new Pods from being scheduled to this node?',
  nodeDrainDisabledText: 'Are you sure you want to safely evict Pods from the node and set them to an unshatchable state to prevent new Pods from being dispatched to that node? (Pods with Pod Disruption Budget mechanism or DaemonSet work load will not be evicted)',
  nodeEnableText: 'Are you sure to enable scheduling and run the new Pod on the node?',
  nodeHealth: 'Health',
  nodeUnhealth: 'Unhealthy',
  large: 'Large',
  small: 'Small',
  labelKeyRegText: 'Label name: starts and ends with numbers and uppercase and lowercase letters. Only numbers, uppercase and lowercase letters, dashes (-), underscores (_) Combination of dot (.) and slash (/), with length less than 63. ',
  labelValueRegText: 'Label value: starts and ends with numbers and uppercase and lowercase letters. Only numbers, uppercase and lowercase letters, dashes (-), underscores (_) Combination of points (.), the length is less than 63. ',
  bdcLabelKeyRegText: 'Tag name: is divided into two parts, an optional prefix and a mandatory name, both separated by a slash (/). Prefix: is one or more tags separated by dots (.) separated by a dot (.), each label must consist of alphanumeric characters or dashes (-), cannot start or end with a dash (-), and is less than 253 in length. name: required, starts and ends with a number, a letter, and only supports combinations of numbers, letters, and dashes (-), and is less than 63 in length.',
  inValid: 'Illegal',
  dashboard: {
    overview: 'Cluster Overview',
    grafanaOverview: 'Grafana @:cluster.dashboard.overview',
    resource: 'Cluster Resource',
    grafanaResource: 'Grafana Cluster Resource',
    serviceAvailability: 'Container operation statistics',
    grafanaServiceAvailability: 'Grafana @:cluster.dashboard.serviceAvailability',
    groupResource: 'Namespace @:common.resources Statistics',
    nodeResource: 'Node @:common.resources Statistics',
    containerResource: 'Container @:common.resources Statistics',
    podLog: 'Pod Log',
    podError: 'Pod Error',
    podResourceUsageTop: 'Pod resource usage Top10'
  },
  nodeMetricInfo: 'Node Metric Info',
  nodeContainer: 'Node Containers',
  nodeInfoItems: {
    operating_system: 'Operating System',
    os_image: 'OS Image',
    kernel_version: 'Kernel',
    container_runtime_version: 'Container Runtime Version'
  },
  addBigDataCluster: 'Add @:menu.bigDataCluster',
  resourceQuotaAndLimitRange: 'Resource control',
  displayName: 'Display Name',
  bdcNameTip: 'Use the security group name as a prefix, fill in the @:cluster.addBigDataClusterNameTip',
  addBigDataClusterNameTip: '2-{max} characters in length, beginning and ending with a lowercase letter or number, and containing only numbers, lowercase letters and `-`.',
  settingDuplicatedNameTip: 'The name already exists in the big data cluster, please refill it.',
  addBigDataClusterGroupTip: 'Specify the security group that the big data cluster belongs to. A big data cluster can only belong to a unique security group',
  addBigDataClusterKerberosTip: 'Please choose carefully! Once the big data cluster is created, Kerberos settings cannot be changed',
  resourceQuotaTip: 'Limit resource quotas for specified types of big data clusters',
  limitRangeTip: 'Set default resource limits for Big Data Cluster Containerizer',
  operateBDCTip: 'Confirmed to {operate} big data cluster `{name}`{alias}?',
  operateBDCConfirmTip: 'Please enter the name of the Big Data cluster in the input box for {operate} confirmation',
  operateBDCBtnTip: 'Please enter the correct Big Data Cluster name',
  validBDCNameTip: 'Duplicate name, please refill',
  systemServiceInstall: 'System Service Install',
  systemServiceTips: 'KDP system operation base service, configuration, certificate information',
  nodeListLabel: 'The system label of the node is not shown here. There are loads that can only run on nodes with the specified label (via selector), adding or removing labels at this point can change the loads that can run on that node',
  nodeListPodLimit: 'Determined by a combination of the node\'s resource limits (e.g., CPU, memory, etc.) as well as the configuration parameters of Kubernetes itself. Pods that exceed the limit will not be scheduled and run.',
  nodeListPod: 'The number of running Pods in the node',
  nodeListSettings: 'Node CPU, Memory configurations',
  nodeListAllocatable: 'Amount of CPU, Memory available for kubelet to run containers on current node',
  nodeListDisk: 'Read/write rate of the largest disk partition in the last 2 minutes',
  nodeListPartitionUsage: 'Maximum utilization of each disk partition in the node',
  nodeListCPU: 'CPU usage:<br>\n  Usage: the sum of actual CPU usage of all containers on the node<br>\n  Usage rate: Usage/allocatable*100%<br>\n\nCPU request:<br>\n  Request: the sum of CPU requests of all containers on the node<br>\n  Request rate: Request/allocatable*100%<br>\n\nCPU limit:<br>\n  Limit: the sum of CPU limits of all containers on the node<br>\n  Limit rate: Limit/allocatable*100%<br>',
  nodeListMem: 'Memory usage:<br>\n  Usage: the sum of actual memory usage of all containers on the node<br>\n  Usage rate: Usage/allocatable*100%<br>\n\nMemory request:<br>\n  Request: the sum of memory requests of all containers on the node<br>\n  Request rate: Request/allocatable*100%<br>\n\nMemory limit:<br>\n  Limit: the sum of memory limits of all containers on the node<br>\n  Limit rate: Limit/allocatable*100%<br>',
  contextSettingOrigin: {
    manual: 'manual',
    system: 'system'
  },
  bdcStatus: {
    disabled: 'Disabled',
    disable: 'Disable',
    enable: 'Enable',
    frozen: 'Frozen',
    active: 'Active',
    inActive: 'InActive',
    terminating: 'Terminating'
  },
  contextSettingsChangeModeSaveTip: 'In the "Code" format, form validation is not available and the [Confirm] button is grayed out. tooltip: Please switch to the "Form" format and click [Confirm] after validation.',
  secret: 'Secret',
  bdcInValidTip: 'This big data cluster configuration is abnormal, please contact Ops to handle it!',
  bdcUnHealthyTip: 'Big Data Cluster quota setting is abnormal, please click the "Resource Control" button to configure and limit the resources.',
  bdcNoResourceTip: 'Resource creation in progress, please refresh and retry later or contact administrator',
  appBdcNotReadyTip: 'Big Data cluster "{status}", application instance update, startup operations are not available, enforcing them will result in instance status exception. Please contact the administrator to adjust the big data cluster status.',
  workflowBdcNotReadyTip: 'Big Data Cluster "{status}", work load restart, set replica, delete operations are not available, enforcing them will cause a load status exception. Please contact the administrator to adjust the big data cluster status.',
  podBdcNotReadyTip: 'Big Data cluster "{status}", Pod instance delete operation is not available, enforcing it will cause Pod status exception. Please contact the administrator to adjust the big data cluster status.',
  updateBdcResourceTip: 'After setting a Resource Quota for the environment, you must specify a CPU/Memory resource limit when creating Pod instances or configure a default resource limit for the environment (LimitRange)',
  bdc: 'Big Data Cluster',
  tenantResource: 'Tenant Resource',
  tenantResourceManage: '@:cluster.tenantResource Manage',
  bdcTenantResource: '@:cluster.bdc@:cluster.tenantResource',
  resourceName: 'Resource name',
  resourceDesc: 'Resource description',
  createBdcTenantResource: 'Create Big Data Cluster {bdc} @:cluster.tenantResource',
  bdcTenantRetryTips: 'Confirm retry @:cluster.tenantResource {name} ?',
  bdcTenantArchiveTips: 'Confirm archive @:cluster.tenantResource {name} ? After archiving, the list will not be visible'
}
