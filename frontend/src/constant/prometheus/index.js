// 此文件统一存放各个列表用到的prometheus表达式

export const PODS_LIST_TARGETS = () => ([
  // 表达式说明：jira BPAAS-1476
  // CPU使用量
  {
    expr: 'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{}) by (namespace, pod)',
    datasourceType: 'prometheus',
    refId: 'cpuUsed'
  },
  // CPU请求量
  {
    expr: 'sum(kube_pod_container_resource_requests{resource="cpu", unit="core"}) by (namespace, pod)',
    datasourceType: 'prometheus',
    refId: 'cpuRequest'
  },
  // CPU 限制量
  {
    expr: 'sum(kube_pod_container_resource_limits{resource="cpu", unit="core"}) by (namespace, pod)',
    datasourceType: 'prometheus',
    refId: 'cpuLimit'
  },
  // 内存使用量
  {
    expr: 'sum (container_memory_working_set_bytes{container!=""}) by (namespace, pod)',
    datasourceType: 'prometheus',
    refId: 'memUsed'
  },
  // 内存请求量
  {
    expr: 'sum (kube_pod_container_resource_requests{resource="memory", unit="byte"}) by (namespace, pod)',
    datasourceType: 'prometheus',
    refId: 'memRequest'
  },
  // 内存限制量
  {
    expr: 'sum (kube_pod_container_resource_limits{resource="memory", unit="byte"}) by (namespace, pod)',
    datasourceType: 'prometheus',
    refId: 'memLimit'
  }
])

export const NODES_LIST_TARGETS = () => ([
  // pod metric 含义： https://github.com/kubernetes/kube-state-metrics/blob/main/docs/pod-metrics.md
  // 常用表达式：http://codefun007.xyz/a/article_detail/985.htm
  // https://cloud.tencent.com/developer/article/1644608

  // 节点node与主机host_ip的对应关系
  {
    datasourceType: 'prometheus',
    expr: 'count(kube_pod_info{}) by (node, host_ip)',
    interval: '',
    refId: 'podInfo'
  },
  // CPU总的可用量
  {
    expr: 'sum(kube_node_status_allocatable{resource="cpu", unit="core"})by (node)',
    datasourceType: 'prometheus',
    refId: 'cpuAllocatableTotal'
  },
  // CPU使用量
  {
    expr: 'sum(irate(container_cpu_usage_seconds_total{container!=""}[2m]))by (node)',
    datasourceType: 'prometheus',
    refId: 'cpuUsed'
  },
  // CPU请求量
  {
    expr: 'sum by (node) (kube_pod_container_resource_requests{resource="cpu", unit="core"}) ',
    datasourceType: 'prometheus',
    refId: 'cpuRequest'
  },
  // CPU 限制量
  {
    expr: 'sum by (node) (kube_pod_container_resource_limits{resource="cpu", unit="core"})',
    datasourceType: 'prometheus',
    refId: 'cpuLimit'
  },
  // 内存总的可用量
  {
    expr: 'sum by (node)(kube_node_status_allocatable{resource="memory", unit="byte"})',
    datasourceType: 'prometheus',
    refId: 'memAllocatableTotal'
  },
  // 内存使用量
  {
    expr: 'sum by (node) (container_memory_working_set_bytes{container!=""})',
    datasourceType: 'prometheus',
    refId: 'memUsed'
  },
  // 内存请求量
  {
    expr: 'sum by (node)(kube_pod_container_resource_requests{resource="memory", unit="byte"})',
    datasourceType: 'prometheus',
    refId: 'memRequest'
  },
  // 内存限制量
  {
    expr: 'sum by (node)(kube_pod_container_resource_limits{resource="memory", unit="byte"})',
    datasourceType: 'prometheus',
    refId: 'memLimit'
  },
  // 磁盘读取
  {
    expr: 'max by (host_ip) (label_replace(rate(node_disk_read_bytes_total{}[2m]),"host_ip","$1","instance","(.*):9100"))',
    datasourceType: 'prometheus',
    refId: 'diskRead',
    dependPrimary: 'host_ip'
  },
  // 磁盘写入
  {
    expr: 'max by (host_ip) (label_replace(rate(node_disk_written_bytes_total{}[2m]),"host_ip","$1","instance","(.*):9100"))',
    datasourceType: 'prometheus',
    refId: 'diskWrite',
    dependPrimary: 'host_ip'
  },
  // 分区使用率
  {
    expr: 'max by (host_ip) ((label_replace(node_filesystem_size_bytes{fstype!~"tmpfs|fuse(.*)|nfs(.*)"},"host_ip","$1","instance","(.*):9100") - label_replace(node_filesystem_free_bytes{fstype!~"tmpfs|fuse(.*)|nfs(.*)"},"host_ip","$1","instance","(.*):9100")) / (label_replace(node_filesystem_avail_bytes {fstype!~"tmpfs|fuse(.*)|nfs(.*)"},"host_ip","$1","instance","(.*):9100") + label_replace(node_filesystem_size_bytes{fstype!~"tmpfs|fuse(.*)|nfs(.*)"},"host_ip","$1","instance","(.*):9100") - label_replace(node_filesystem_free_bytes{fstype!~"tmpfs|fuse(.*)|nfs(.*)"},"host_ip","$1","instance","(.*):9100")))',
    datasourceType: 'prometheus',
    refId: 'partitionUsage',
    dependPrimary: 'host_ip'
  }
])

export const WORKLOAB_LIST_TARGETS = () => ([
  // 表达式说明：jira BPAAS-1476
  // CPU使用量
  {
    expr: 'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{}  * on(namespace,pod)   group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{}) by (namespace, workload_type, workload)',
    datasourceType: 'prometheus',
    refId: 'cpuUsed'
  },
  // CPU请求量
  {
    expr: 'sum(kube_pod_container_resource_requests{job="kube-state-metrics", resource="cpu"}  * on(namespace,pod)   group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{}) by (namespace, workload_type, workload)',
    datasourceType: 'prometheus',
    refId: 'cpuRequest'
  },
  // CPU 限制量
  {
    expr: 'sum(kube_pod_container_resource_limits{job="kube-state-metrics", resource="cpu"}  * on(namespace,pod)  group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{}) by (namespace, workload_type, workload)',
    datasourceType: 'prometheus',
    refId: 'cpuLimit'
  },

  // 内存使用量
  {
    expr: 'sum(container_memory_working_set_bytes{container!="", image!=""}  * on(namespace,pod)   group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{}) by (namespace, workload_type, workload)',
    datasourceType: 'prometheus',
    refId: 'memUsed'
  },
  // 内存请求量
  {
    expr: 'sum(kube_pod_container_resource_requests{job="kube-state-metrics", resource="memory"}  * on(namespace,pod)   group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{}) by (namespace, workload_type, workload)',
    datasourceType: 'prometheus',
    refId: 'memRequest'
  },
  // 内存限制量
  {
    expr: 'sum(kube_pod_container_resource_limits{job="kube-state-metrics", resource="memory"}  * on(namespace,pod)   group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{}) by (namespace, workload_type, workload)',
    datasourceType: 'prometheus',
    refId: 'memLimit'
  }
])

export const CONTAINER_LIST_TARGETS = () => ([
  // CPU使用量
  {
    expr: 'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{namespace="$namespace", pod="$pod"}) by (namespace, pod, container)',
    datasourceType: 'prometheus',
    refId: 'cpuUsed'
  },
  // CPU请求量
  {
    expr: 'sum(kube_pod_container_resource_requests{resource="cpu", unit="core", namespace="$namespace", pod="$pod"}) by (namespace, pod, container)',
    datasourceType: 'prometheus',
    refId: 'cpuRequest'
  },
  // CPU 限制量
  {
    expr: 'sum(kube_pod_container_resource_limits{resource="cpu", unit="core", namespace="$namespace", pod="$pod"}) by (namespace, pod, container)',
    datasourceType: 'prometheus',
    refId: 'cpuLimit'
  },
  // 内存使用量
  {
    expr: 'sum (container_memory_working_set_bytes{container!="", image!="", namespace="$namespace", pod="$pod"}) by (namespace, pod, container)',
    datasourceType: 'prometheus',
    refId: 'memUsed'
  },
  // 内存请求量
  {
    expr: 'sum (kube_pod_container_resource_requests{resource="memory", unit="byte", namespace="$namespace", pod="$pod"}) by (namespace, pod, container)',
    datasourceType: 'prometheus',
    refId: 'memRequest'
  },
  // 内存限制量
  {
    expr: 'sum (kube_pod_container_resource_limits{resource="memory", unit="byte", namespace="$namespace", pod="$pod"}) by (namespace, pod, container)',
    datasourceType: 'prometheus',
    refId: 'memLimit'
  }
])

export const LOG_LIST_TARGETS = () => ([
  // 日志查看
  {
    expr: '{namespace=~"$namespace", container=~"$container", pod=~"$pod"}\n|~ `$keyword`\n',
    datasourceType: 'loki'
  }
])
