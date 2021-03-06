import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import md5 from 'js-md5'

import initJs from '@/utils/init'
import globalJs from '@/utils/global'

// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'

// Vue.use(preview)

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer);
Viewer.setDefaults({
  Options: { 
    "inline": true, 
    "button": true, 
    "navbar": true, 
    "title": true, 
    "toolbar": false, 
    "tooltip": true, 
    "movable": true, 
    "zoomable": true, 
    "rotatable": true, 
    "scalable": true, 
    "transition": true, 
    "fullscreen": true, 
    "keyboard": true, 
    "url": "data-source"
  }
});


Vue.prototype.$md5 = md5

Vue.use(globalJs)
initJs()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
