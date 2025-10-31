import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const Home = () => import('@/pages/Home.vue')
const About = () => import('@/pages/About.vue')
const Settings = () => import('@/pages/Settings.vue')
const Quiz = () => import('@/pages/Quiz.vue')
const Login = () => import('@/pages/Login.vue')

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/login', name: 'Login', component: Login },
  { path: '/quiz', name: 'Quiz', component: Quiz },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta && (to.meta as any).requiresAuth) {
    const userStore = useUserStore();
    if (!userStore.user) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }
  next()
})

export default router
