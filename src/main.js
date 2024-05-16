import { createApp } from 'vue';
import App from './App.vue';
import {
    components,
    plugins
} from './utils/elementPlus.js'
import router from './router';
import store from './store';

const app = createApp(App);
components.forEach(component => {
    app.component(component.name, component)
})

plugins.forEach(plugin => {
    app.use(plugin)
})
app.use(router);
app.use(store);
app.mount('#app');
