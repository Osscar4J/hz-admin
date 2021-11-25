import request from '@/utils/request'

export default {
  login(data) {
    return request({
      url: '/auth/api/auth/login',
      method: 'post',
      data
    })
  },

  updatePassword(data) {
    return request({
      url: '/auth/api/account/updatePassword',
      method: 'put',
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
  },

  getPage(data) {
    return request({
      url: '/admin/api/user',
      method: 'get',
      params: data
    })
  },

  /**
   * 注销用户，永久删除
   * @param {*} id 用户id
   * @returns 
   */
  deleteUserFarewell(id) {
    return request({
      url: '/admin/api/user/del/' + id,
      method: 'delete',
    })
  },

  resetPassword(userId, pwd) {
    return request({
      url: '/admin/api/user/resetPassword',
      method: 'put',
      data: {
        userId: userId,
        pwd: pwd
      }
    })
  }
}
