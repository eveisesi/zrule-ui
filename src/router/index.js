import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Login from "@/views/Login"
import Logout from '@/views/Logout'
import Policy from '@/views/Policy'
import store from "@/store/index";

Vue.use(VueRouter)

const routes = [
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/policies/:id",
    name: "Policy",
    component: Policy,
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


router.beforeEach((to, from, next) => {

  const isAuthenticated = store.getters.isAuthed
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
