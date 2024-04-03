import * as types from '../types'

const baseApis = 'catalogManagerService/api/v1/catalogs'

export default {
  [types.GET_CATALOGS]: () => ({
    method: 'get',
    path: `${baseApis}`
  }),
  [types.GET_CATALOG]: ({ catalog }) => ({
    method: 'get',
    path: `${baseApis}/${catalog}`
  }),
  [types.GET_CATALOGS_README]: ({ catalog }) => ({
    method: 'get',
    path: `${baseApis}/${catalog}/readme`
  }),
  [types.GET_CATALOGS_APP_FORMS]: ({ catalog }) => ({
    method: 'get',
    path: `${baseApis}/${catalog}/app_forms`
  }),
  [types.GET_CATALOGS_APP_FORM]: ({ catalog, form }) => ({
    method: 'get',
    path: `${baseApis}/${catalog}/app_forms/${form}`
  }),
  [types.GET_CATALOGS_APP_FORMS_DATA]: ({ catalog, form }) => ({
    method: 'get',
    path: `${baseApis}/${catalog}/app_forms/${form}/data`
  }),
  [types.GET_CATALOGS_APP_FORMS_INSTALL]: ({ catalog, form }) => ({
    method: 'get',
    path: `${baseApis}/${catalog}/app_forms/${form}/install`
  }),
  [types.GET_CATALOGS_APP_FORMS_README]: ({ catalog, form }) => ({
    method: 'get',
    path: `${baseApis}/${catalog}/app_forms/${form}/readme`
  }),
  [types.GET_CATALOGS_APP_FORMS_APPS]: () => ({
    method: 'get',
    path: `${baseApis}/app_forms/apps`
  })
}
