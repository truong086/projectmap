import { createApp } from 'vue'
import App from './App.vue'
import VueMap from '@fawmi/vue-google-maps';
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
app.use(VueMap, {
    load: {
        key: 'AIzaSyBkgBNM7Mtgg6I3SvhOlwZCgqp7vFAPrS8',
        libraries: 'places' // Để hỗ trợ tìm kiếm
    }
})
app.use(VueAxios, axios)
app.mount('#app')
