import request from '@/utils/request'

export const getUserAPI = () => {
  return request({
    url: '/user',
    method: 'get',
  })
}

