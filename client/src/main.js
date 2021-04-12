import { createApp } from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import store from './store';
import router from './router';
import './assets/css/tailwind.css';

const app = createApp(App)
              .use(store)
              .use(Vuex)
              .use(router)


app.mount('#app')
