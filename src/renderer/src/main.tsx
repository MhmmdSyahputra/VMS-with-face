import './assets/main.css'
import '@mantine/core/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './../../../resources/bootstrap-5.3.3-dist/css/bootstrap.css'
import './../../../resources/bootstrap-5.3.3-dist/css/bootstrap.min.css'
import '@mantine/notifications/styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
