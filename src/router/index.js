import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import main from '../views/MainView.vue'
import welcome from '../views/welcome.vue'
import wxlogin from '../views/WXlogin.vue'
import delgzh from '../views/delgzh.vue'
import bindgzh from '../views/bindgzh.vue'
import mpwx from '../views/mpwx.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    // path: '/tools',
    path: '/tools',
    name: '',
    component: main,
    children: [{
      path: '',
      component: welcome,
      meta: []
    }, {
      path: '/wxlogin',
      component: wxlogin,
      meta: []
    }, {
      path: '/delgzh',
      component: delgzh,
      meta: []
    }, {
      path: '/bindgzh',
      component: bindgzh,
      meta: []
    }]
  }, {
    path: '/mpwx',
    component: mpwx,
    meta: []
  }
]

const router = new VueRouter({
  routes
})

export default router
