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
  { path: '/settings', name: 'Settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // If not authenticated and not already on Login page, redirect to Login
  if (!userStore.user && to.name !== 'Login') {
    // Store redirect path for after login
    sessionStorage.setItem('loginRedirect', to.fullPath)
    next({ name: 'Login' })
    return
  }
  
  // If user is already logged in and trying to go to login page, redirect to home
  if (to.name === 'Login' && userStore.user) {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router
