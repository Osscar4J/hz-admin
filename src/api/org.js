import request from '@/utils/request'

export default {
  getPage(data) {
    return request({
      url: '/admin/api/org',
      method: 'get',
      params: data
    })
  },
}
