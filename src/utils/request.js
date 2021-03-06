import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, getRefreshToken, getTokenExpired, removeToken, removeRefreshToken } from '@/utils/auth'
import Vue from 'vue'

const refreshToken = function() {
  return service({
    url: '/auth/api/auth/refreshToken',
    method: 'get',
    headers: {
      refresh: getRefreshToken()
    },
    success: res => {
      console.log(res)
      if (res.code == 401) {
        removeToken()
        removeRefreshToken()
        // router.push('/')
      }
    }
  })
}

const interceptor = async function(config) {
  if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers['X-Token'] = store.getters.token || getToken()

    if (!config.url.match(/\/auth\/api\/auth\/login/) && !config.url.match(/\/auth\/api\/auth\/refreshToken/)) {
      const expire = getTokenExpired()

      if (new Date().getTime() > expire) {
        console.log('================ refresh token ================')
        const res = await refreshToken()
        setToken(res.content)
      }
    }
    if (config.url.match(/^\/api\//)) {
      config.url = '/admin' + config.url
    }
  }
  return config
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  interceptor,
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    const res = response.data

    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      Message({
        message: res.msg || res.message || 'Error',
        type: 'error',
        duration: 3500
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.code == 401) { // ????????????
        await refreshToken()
      }
      return res // Promise.reject(res.msg || res.message || 'Error')
    } else {
      if (res.content && res.content.records){
        res.content.current = parseInt(res.content.current)
        res.content.pages = parseInt(res.content.pages)
        res.content.size = parseInt(res.content.size)
        res.content.total = parseInt(res.content.total)
      }
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: error.msg || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    Vue.prototype.$hideLoading()
    return Promise.reject(error)
  }
)

export default service
