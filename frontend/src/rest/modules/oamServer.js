import * as types from '../types'

const baseApis = 'oamServer/v1'

export default {
  [types.GET_APP_RESOURCES_TOPOLOGY]: ({ appName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}/resources/topology`
  }),
  [types.GET_APP_KIND_RESOURCES_DETAIL]: ({ appName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}/resources/detail`
  }),
  [types.GET_APPLICATION]: ({ appName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}`
  }),
  [types.PUT_APPLICATION]: ({ appName }) => ({
    method: 'put',
    path: `${baseApis}/applications/${appName}`
  }),
  [types.DELETE_APPLICATION]: ({ appName }) => ({
    method: 'delete',
    path: `${baseApis}/applications/${appName}`
  }),
  [types.POST_BDC_APPLICATION]: ({ bdcName }) => ({
    method: 'post',
    path: `${baseApis}/bigdataclusters/${bdcName}/applications`
  }),
  [types.GET_BDC_APPLICATION_DEFINITION_SCHEMA]: ({ bdcName, defType }) => ({
    method: 'get',
    path: `${baseApis}/bigdataclusters/${bdcName}/applications/definitions/${defType}/schema`
  }),
  [types.GET_BDCS]: () => ({
    method: 'get',
    path: `${baseApis}/bigdataclusters`
  }),
  [types.GET_BDC]: ({ bdcName }) => ({
    method: 'get',
    path: `${baseApis}/bigdataclusters/${bdcName}`
  }),
  [types.GET_BDC_CONTEXT_SECRET_DEFINITION_SCHEMA]: ({ bdcName, defType }) => ({
    method: 'get',
    path: `${baseApis}/bigdataclusters/${bdcName}/contextsecrets/definitions/${defType}/schema`
  }),
  [types.GET_BDC_CONTEXT_SECRETS]: () => ({
    method: 'get',
    path: `${baseApis}/contextsecrets`
  }),
  [types.GET_BDC_CONTEXT_SECRET]: ({ name }) => ({
    method: 'get',
    path: `${baseApis}/contextsecrets/${name}`
  }),
  [types.GET_BDC_CONTEXT_SETTING_DEFINITION_SCHEMA]: ({ bdcName, defType }) => ({
    method: 'get',
    path: `${baseApis}/bigdataclusters/${bdcName}/contextsettings/definitions/${defType}/schema`
  }),
  [types.GET_BDC_CONTEXT_SETTINGS]: () => ({
    method: 'get',
    path: `${baseApis}/contextsettings`
  }),
  [types.GET_BDC_CONTEXT_SETTING]: ({ name }) => ({
    method: 'get',
    path: `${baseApis}/contextsettings/${name}`
  }),
  [types.GET_APP_DETAIL]: ({ appName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}/detail`
  }),
  [types.GET_APPLICATION_PODS]: ({ appName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}/pods`
  }),
  [types.GET_APPLICATION_POD_DETAIL]: ({ appName, podName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}/pods/${podName}`
  }),
  [types.GET_APPLICATION_SERVICE_ENDPOINTS]: ({ appName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}/serviceEndpoints`
  }),
  [types.DELETE_APPLICATION_POD]: ({ appName, podName }) => ({
    method: 'delete',
    path: `${baseApis}/applications/${appName}/pods/${podName}`
  }),
  [types.GET_APPLICATIONS]: () => ({
    method: 'get',
    path: `${baseApis}/applications`
  }),
  [types.GET_APPLICATION_POD_CONTAINER_LOGS]: ({ appName, podName, containerName }) => ({
    method: 'get',
    path: `${baseApis}/applications/${appName}/pods/${podName}/containers/${containerName}/logs`
  })
}
