import { MessageBox, Message } from 'element-ui'

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

        if (!Vue.prototype.$message){
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
	}
}
