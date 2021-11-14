import request from '@/utils/request'
import Constants from '@/constants'

const OSS = require('ali-oss');
const REGION = 'oss-cn-shanghai'
const BUCKET = 'hezhiyf'
let OSSClient = null
let STSToken = null
const FOLDER = '/'
const EXPIRED = 3500 // token有效期，3500秒
let getTokenTime = 0 // 获取token的时间

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

  getSts() {
    return request({
      url: '/auth/api/file/sts',
      method: 'get'
    })
  },

  upload(params) {
    const key = FOLDER + params.filename;
    const options = {
      progress: params.progress,
      partSize: params.partSize || 100 * 1024
    };

    this.getClient().then(client => {
      client.multipartUpload(key, params.file, options).then( (res) => {
        typeof params.success === 'function' && params.success(res)
      }).catch((err) => {
        if (client && client.isCancel()) {
          console.log('stop-upload!');
        } else {
          console.error(err);
        }
      })
    })
  },
  
  async publicRead(filepath) {
    await this.getClient()
    return OSSClient.putACL(filepath, 'public-read')
  },

  async deleteFile(filepath) {
    await this.getClient()
    return OSSClient.delete(filepath.replace(Constants.OSS_URL, ''));
  },

  getClient() {
		if (!OSSClient || new Date().getTime()/1000-getTokenTime > EXPIRED) {
			return this.getSts().then(res => {
        getTokenTime = new Date().getTime()/1000
        STSToken = res.content
        OSSClient = new OSS({
          region: REGION,
          accessKeyId: res.content.accessKey,
          accessKeySecret: res.content.accessKeySecret,
          stsToken: res.content.securityToken,
          bucket: BUCKET
        });
      })
		} else {
      return new Promise((resolve, reject) => {
        resolve(OSSClient)
      })
		}
	},
}
