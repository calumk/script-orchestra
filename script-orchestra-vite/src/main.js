import { createApp } from 'vue'

import { createRouter, createWebHistory } from 'vue-router'

import PrimeVue from 'primevue/config';

import Home from './views/Home.vue'
import About from './views/About.vue'
import Command from './views/Command.vue'

// import './style.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeflex/primeflex.css'
import './style.css'

import App from './App.vue'
const router = createRouter({
    history: createWebHistory(),
    routes : [
        { path: '/', component: Home },
        { path: '/about', component: About },
        {
            path: '/command/:group_id/:command_id', 
            name: 'Command',
            component: Command
        }
    ]
})


const app = createApp(App);
app.use(PrimeVue);
app.use(router)
app.mount('#app')
