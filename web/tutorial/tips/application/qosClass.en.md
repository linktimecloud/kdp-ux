Kubernetes uses the quality of service type to make the decision to expel Pod when the node resources are insufficient. First, consider that the usage exceeds the requested BestEffort and Burstable type Pod, and the resource usage is less than the requested Guaranteed and Burstable type Pod.

- Guaranteed: Each container in Pod must specify CPU and memory requests and limits, and the request amount is equal to the limit amount
- Burstable: At least one container in Pod specifies the request or limit of CPU or memory
- BestEffort: No request or limit of CPU or memory is set for any container in Pod