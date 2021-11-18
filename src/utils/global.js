import { Message, Loading } from 'element-ui'

export default {
	install: function(Vue, options) {
        if (!Vue.prototype.$toast){
            Vue.prototype.$toast = (msg) => {
                Message({
                    message: msg || '',
                    type: 'info',
                    duration: 3500
                })
            }
        }

        if (!Vue.prototype.$message) {
            Vue.prototype.$message = {
                success: msg => {
                    Message({
                        message: msg,
                        type: 'success',
                        duration: 3500
                    })
                },

                error: msg => {
                    Message({
                        message: msg,
                        type: 'error',
                        duration: 3500
                    })
                }
            }
        }

        if (!Vue.prototype.$showLoading) {
            let loadingInstance = null
            Vue.prototype.$showLoading = options => {
                options = options || {}
                options.background = 'rgba(0,0,0,.6)'
                loadingInstance = Loading.service(options)
            }

            Vue.prototype.$hideLoading = options => {
                if (loadingInstance) {
                    loadingInstance.close()
                }
            }
        }
	}
}
