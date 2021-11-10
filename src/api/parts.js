import request from '@/utils/request'

export default {
  getPage(data) {
    return request({
      url: '/admin/api/parts',
      method: 'get',
      data: data
    })
  },
}
