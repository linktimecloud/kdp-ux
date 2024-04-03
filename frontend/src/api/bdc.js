import request from '@/utils/request'

const base = 'oamServer/v1'

export const getBdcListAPI = () => {
  return request({
    url: `${base}/bigdataclusters`,
    method: 'get',
  })
}

export const getBdcAPI = ({ bdcName }) => {
  return request({
    url: `${base}/bigdataclusters/${bdcName}`,
    method: 'get',
  })
}

export const postBdcApplicationAPI = ({ bdcName, data }) => {
  return request({
    url: `${base}/bigdataclusters/${bdcName}/applications`,
    method: 'post',
    data
  })
}

export const getBdcApplicationDefinitionSchemaAPI = ({ bdcName, defType }) => {
  return request({
    url: `${base}/bigdataclusters/${bdcName}/applications/definitions/${defType}/schema`,
    method: 'get'
  })
}

export const getBdcContextSettingDefinitionSchemaAPI = ({ bdcName, defType }) => {
  return request({
    url: `${base}/bigdataclusters/${bdcName}/contextsettings/definitions/${defType}/schema`,
    method: 'get'
  })
}

export const getBdcContextSecretDefinitionSchemaAPI = ({ bdcName, defType }) => {
  return request({
    url: `${base}/bigdataclusters/${bdcName}/contextsecrets/definitions/${defType}/schema`,
    method: 'get'
  })
}

export const getBdcContextSettingsAPI = (params) => {
  return request({
    url: `${base}/contextsettings`,
    method: 'get',
    params
  })
}

export const getBdcContextSettingAPI = ({ name }) => {
  return request({
    url: `${base}/contextsettings/${name}`,
    method: 'get'
  })
}

export const getBdcContextSecretsAPI = (params) => {
  return request({
    url: `${base}/contextsecrets`,
    method: 'get',
    params
  })
}

export const getBdcContextSecretAPI = ({ name }) => {
  return request({
    url: `${base}/contextsecrets/${name}`,
    method: 'get'
  })
}



