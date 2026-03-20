import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/schedule', component: ScheduleView },
  { path: '/admin', component: AdminView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if ((to.path === '/schedule' || to.path === '/admin') && !token) {
    return next('/')
  }

  if (to.path === '/admin' && user.role !== 'secretario') {
    return next('/schedule')
  }

  next()
})

export default router