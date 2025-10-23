import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
// Material Design Icons
import '@mdi/font/css/materialdesignicons.min.css'
// Global common styles
import '@/styles/common.css'
import { createVuetify } from 'vuetify'
import { ja } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Determine saved theme (light/dark)
const savedTheme = (typeof window !== 'undefined' && window.localStorage)
  ? window.localStorage.getItem('theme') || 'light'
  : 'light'

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'ja',
    messages: { ja }
  },
  theme: {
    defaultTheme: savedTheme,
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#1976D2',
          secondary: '#424242',
          error: '#B00020',
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#90CAF9',
          secondary: '#BDBDBD',
          error: '#CF6679',
        }
      }
    }
  }
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')

// expose vuetify for runtime theme changes
export { vuetify }
