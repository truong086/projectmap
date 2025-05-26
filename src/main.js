import { createApp } from 'vue'
import App from './App.vue'
import VueMap from '@fawmi/vue-google-maps';
// import VueMap from 'vue3-google-map';
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'; 
// import "bootstrap"
// import "bootstrap/dist/css/bootstrap.min.css"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import store from './store'
// import Toast from 'vue-toastification'
import Vue3Notification from '@kyvg/vue3-notification'

const app = createApp(App)
// app.config.globalProperties.hostname = "https://localhost:44377"
app.config.globalProperties.hostname = "http://34.80.69.96:5000"
// app.config.globalProperties.hostname = "https://aa27-34-80-69-96.ngrok-free.app"
const pinia = createPinia();
app.use(pinia);
app.use(VueMap, {
    load: {
        key: 'AIzaSyCNPqyJ8qQrE8OjuvpyU66bPrNe1Ej9MRU',
        // libraries: ['places', 'visualization'] // Để hỗ trợ tìm kiếm
        libraries: 'places',
        language: 'zh-TW',
        v: 'beta'
    }
})
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(store)
// app.use(Toast)
app.use(VueAxios, axios)
app.use(Vue3Notification)
app.mount('#app')
