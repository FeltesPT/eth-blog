import { createStore } from 'vuex'
import app from './modules/app';
import account from './modules/account';

// Load Vuex
// Vue.use(Vuex);
// Create store
export default createStore({
    modules: {
        app,
        account
    },
});
