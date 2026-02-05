import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AppGate from './auth/AppGate.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <AppGate>
                <App />
            </AppGate>
        </BrowserRouter>
    </Provider>
)
