import request from '@/utils/request'

export default {
  getPage(data) {
    return request({
      url: '/admin/api/banner',
      method: 'get',
      params: data
    })
  },

  getInfo(id) {
    return request({
      url: '/api/banner/info/' + id,
      method: 'get',
    })
  },

  saveOrUpdate(data) {
    return request({
      url: '/admin/api/banner',
      method: 'post',
      data: data
    })
  },

  removeById(id) {
    return request({
      url: '/admin/api/banner/' + id,
      method: 'delete',
    })
  },
}
