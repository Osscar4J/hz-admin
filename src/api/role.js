import request from '@/utils/request'

const baseApi = '/api/role'

export default {
  getPage(data) {
    return request({
      url: baseApi,
      method: 'get',
      params: data
    })
  },
}
