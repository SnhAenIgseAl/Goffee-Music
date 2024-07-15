import { createApp } from 'vue'
import Vuex from 'vuex'
import store from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.css'
import './assets/css/myElementUI.css'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
import App from './App.vue'
import router from './router'



// 定义特性标志
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;



const app = createApp(App)



app.use(router)
app.use(Vuex)
app.use(store)
app.use(ElementPlus)
app.mount('#app')




