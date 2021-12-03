import request from '@/utils/request'

const baseApi = '/api/repairMan'

export default {
  getPage(data) {
    return request({
      url: baseApi,
      method: 'get',
      params: data
    })
  },

  getInfo(id) {
    return request({
      url: baseApi + '/info/' + id,
      method: 'get',
    })
  },

  saveOrUpdate(data) {
    return request({
        url: baseApi,
        method: 'post',
        data: data
    })
  },

  removeById(id) {
    return request({
      url: baseApi + '/' + id,
      method: 'delete',
    })
  },
}
