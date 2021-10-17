import request from '@/utils/request'

export default {
  login(data) {
    return request({
      url: '/auth/api/auth/login',
      method: 'post',
      data
    })
  },

  getInfo() {
    return request({
      url: '/admin/api/user/info',
      method: 'get'
    })
  },

  logout() {
    return request({
      url: '/admin/api/user/logout',
      method: 'delete'
    })
  }
}
