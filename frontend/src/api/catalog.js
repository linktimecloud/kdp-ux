import request from '@/utils/request'

const base = 'catalogManagerService/api/v1/catalogs'

export const getCatalogsAPI = () => {
  return request({
    url: `${base}`,
    method: 'get'
  })
}

export const getCatalogAPI = ({ catalog }) => {
  return request({
    url: `${base}/${catalog}`,
    method: 'get'
  })
}

export const getCatalogsReadmeAPI = ({ catalog }) => {
  return request({
    url: `${base}/${catalog}/readme`,
    method: 'get'
  })
}

export const getCatalogsAppFormsAPI = ({ catalog }) => {
  return request({
    url: `${base}/${catalog}/app_forms`,
    method: 'get'
  })
}

export const getCatalogsAppFormAPI = ({ catalog, form }) => {
  return request({
    url: `${base}/${catalog}/app_forms/${form}`,
    method: 'get'
  })
}

export const getCatalogsAppFormsDataAPI = ({ catalog, form }) => {
  return request({
    url: `${base}/${catalog}/app_forms/${form}/data`,
    method: 'get'
  })
}

export const getCatalogsAppFormsInstallAPI = ({ catalog, form }) => {
  return request({
    url: `${base}/${catalog}/app_forms/${form}/install`,
    method: 'get'
  })
}

export const getCatalogsAppFormsReadmeAPI = ({ catalog, form }) => {
  return request({
    url: `${base}/${catalog}/app_forms/${form}/readme`,
    method: 'get'
  })
}

export const getCatalogsAppFormsAppsAPI = (params) => {
  return request({
    url: `${base}/app_forms/apps`,
    method: 'get',
    params
  })
}
