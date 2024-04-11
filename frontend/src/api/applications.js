import request from '@/utils/request'

const base = 'oamServer/v1'

export const getAppResourcesTopologyAPI = ({ appName }) => {
  return request({
    url: `${base}/applications/${appName}/resources/topology`,
    method: 'get'
  })
}

export const getAppKindResourcesDetailAPI = ({ appName, params }) => {
  return request({
    url: `${base}/applications/${appName}/resources/detail`,
    method: 'get',
    params
  })
}

export const getAppListAPI = (params) => {
  return request({
    url: `${base}/applications`,
    method: 'get',
    params
  })
}

export const getAppAPI = ({ appName }) => {
  return request({
    url: `${base}/applications/${appName}`,
    method: 'get'
  })
}

export const getAppDetailAPI = ({ appName }) => {
  return request({
    url: `${base}/applications/${appName}/detail`,
    method: 'get'
  })
}

export const putAppAPI = ({ appName, data }) => {
  return request({
    url: `${base}/applications/${appName}`,
    method: 'put',
    data
  })
}

export const deleteAppAPI = ({ appName, data }) => {
  return request({
    url: `${base}/applications/${appName}`,
    method: 'delete',
    data
  })
}

export const getAppPodsAPI = ({ appName }) => {
  return request({
    url: `${base}/applications/${appName}/pods`,
    method: 'get'
  })
}

export const getAppPodDetailAPI = ({ appName, podName }) => {
  return request({
    url: `${base}/applications/${appName}/pods/${podName}`,
    method: 'get'
  })
}

export const getAppServiceEndpointsAPI = ({ appName }) => {
  return request({
    url: `${base}/applications/${appName}/serviceEndpoints`,
    method: 'get'
  })
}

export const deleteAppPodAPI = ({ appName, podName, data }) => {
  return request({
    url: `${base}/applications/${appName}/pods/${podName}`,
    method: 'delete',
    data
  })
}

export const getAppPodContainerLogsAPI = ({ appName, podName, containerName, data }) => {
  return request({
    url: `${base}/applications/${appName}/pods/${podName}/containers/${containerName}/logs`,
    method: 'get',
    params: data
  })
}