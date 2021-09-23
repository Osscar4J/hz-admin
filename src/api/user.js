import request from '@/utils/request'

export default {
  login(data) {
    return request({
      url: '/vue-admin-template/user/login',
      method: 'post',
      data
    })
  },

  getInfo(token) {
    return request({
      url: '/vue-admin-template/user/info',
      method: 'get',
      params: { token }
    })
  },

  logout() {
    return request({
      url: '/vue-admin-template/user/logout',
      method: 'post'
    })
  }
}
