import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import AuthProvider from '@/context/AuthProvider'
import ThemeProvider from '@/context/ThemeProvider'
import ToastProvider from '@/context/ToastProvider'
import '@/index.css'
import { initThemeFromStorage } from '@/utils/theme'

initThemeFromStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
