import request from '@/utils/request'

export const postDashboardQueryAPI = (data) => {
  return request({
    url: '/dashboard/query',
    method: 'post',
    data
  })
}

export const postDashboardQueryRangeAPI = (data) => {
  return request({
    url: '/dashboard/queryrange',
    method: 'post',
    data
  })
}

export const getDashboardConfigAPI = (params) => {
  return request({
    url: '/dashboard/config',
    method: 'get',
    params
  })
}