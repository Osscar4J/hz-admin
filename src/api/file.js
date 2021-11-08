import request from '@/utils/request'

export default {
  getFileAuth(data) {
      if (data.file.indexOf('http') == 0){
          let fileUrl = data.file.replace(/http[s]?:\/\//, '')
          let start = fileUrl.indexOf('/')
          data.file = fileUrl.substr(start + 1)
      }
    return request({
      url: '/auth/api/file/auth',
      method: 'get',
      params: data
    })
  },
}
