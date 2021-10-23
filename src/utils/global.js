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
	}
}
