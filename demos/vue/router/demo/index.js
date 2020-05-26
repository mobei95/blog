import vueRouter from '../../router'
import test from './src/components/test.vue'
import home from './src/components/home.vue'
import App from './src/components/app.vue'

Vue.use(vueRouter)
const router = new vueRouter({
  mode: 'hash',
  routes: [{
    path: '/',
    name: 'home',
    component: home
  }, {
    path: '/test',
    name: 'test',
    component: test
  }]
})

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})