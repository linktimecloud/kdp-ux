import request from '@/utils/request'

export const getTutorialTipsAPI = (params) => {
  return request({
    url: 'tutorial/tips',
    method: 'get',
    params
  })
}

