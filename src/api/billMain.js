import request from '@/utils/request'

const baseApi = '/api/billMain'

export default {
  getPage(data) {
    return request({
      url: baseApi,
      method: 'get',
      params: data
    })
  },

  getBillPage(data) {
    return request({
      url: baseApi + '/bills',
      method: 'get',
      params: data
    })
  },

  save(data) {
    return request({
      url: baseApi,
      method: 'post',
      data: data
    })
  },
}
