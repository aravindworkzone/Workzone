import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AppGate from './auth/AppGate.jsx'
import './index.css'
// Imported for its side effect: it must be listening before Chrome fires
// beforeinstallprompt, which can happen before anything renders.
import './hooks/useInstallPrompt.js'
import App from './App.jsx'

// PWA: register the service worker in production builds only, so the dev
// server always serves fresh files while you work.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .catch((err) => console.error('Service worker registration failed', err))
    })
}

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <AppGate>
                <App />
            </AppGate>
        </BrowserRouter>
    </Provider>
)
