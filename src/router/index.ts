import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/api/dummyApi'

const Home = () => import('@/pages/Home.vue')
const About = () => import('@/pages/About.vue')
const Settings = () => import('@/pages/Settings.vue')
const Quiz = () => import('@/pages/Quiz.vue')

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/quiz', name: 'Quiz', component: Quiz },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta && (to.meta as any).requiresAuth) {
    if (!isAuthenticated()) {
      next({ name: 'Home' })
      return
    }
  }
  next()
})

export default router
