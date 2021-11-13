import request from '@/utils/request'

const baseApi = '/auth/api/common'

export default {
  getAreas(data) {
    return request({
      url: baseApi + '/areas',
      method: 'get',
      params: data
    })
  }
}
