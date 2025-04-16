// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { IngestionProvider } from './context/IngestionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <IngestionProvider>
        <App />
      </IngestionProvider>
    </BrowserRouter>
  </React.StrictMode>
)