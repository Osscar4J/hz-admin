import request from '@/utils/request'

const baseApi = '/api/order'

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

  changeRepairMan(orderId, repairManId) {
    return request({
      url: baseApi + '/changeRepairMan',
      method: 'put',
      data: {
        orderId: orderId,
        repairUserId: repairManId
      }
    })
  },
}
