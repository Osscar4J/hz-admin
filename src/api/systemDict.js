import request from '@/utils/request'

const baseApi = '/api/sysDict'

export default {
  getPage(data) {
    return request({
      url: baseApi,
      method: 'get',
      params: data
    })
  },

  update(data) {
    return request({
      url: baseApi,
      method: 'put',
      data: data
    })
  },
}
