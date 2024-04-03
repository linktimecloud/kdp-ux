import request from '@/utils/request'

export const getProcessListAPI = (params) => {
  return request({
    url: 'processes',
    method: 'get',
    params
  })
}

export const getProcessDetailLogsAPI = ({ pid }) => {
  return request({
    url: `processes/${pid}`,
    method: 'get'
  })
}
