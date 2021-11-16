import request from '@/utils/request'

export default {
  getPage(data) {
    return request({
      url: '/admin/api/org',
      method: 'get',
      params: data
    })
  },

  getInfo(id) {
    return request({
      url: '/admin/api/org/info/' + id,
      method: 'get',
    })
  },

  getAuthInfo(id) {
    return request({
      url: '/admin/api/org/auth/' + id,
      method: 'get',
    })
  },

  updateById(data) {
    return request({
      url: '/admin/api/org',
      method: 'put',
      data: data
    })
  },

  /**
   * 审核单位
   * @param {*} data { status: 1 pass, 2 reject, id: orgId, groupId: 维修站id }
   * @returns 
   */
  checkOrgAuth(data) {
    return request({
      url: '/admin/api/org/checkOrgAuth',
      method: 'put',
      data: data
    })
  },
}
