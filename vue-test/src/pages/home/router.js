import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// var Home = import(/* webpackChunkName: "homeindex" */ './views/Home.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: `${process.env.BASE_URL}/home.html`,
  routes: [
    {
      path: '',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        keep: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        keep: false
      }
    }
  ]
})
