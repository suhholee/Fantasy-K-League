import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.scss'
import App from './App'

// Import the favicon
import favicon from '../public/favicon.png'

// Create a link element
const link = document.createElement('link')
link.rel = 'icon'
link.href = favicon

// Append the link element to the head of the document
document.head.appendChild(link)

createRoot(document.getElementById('root')).render(<App />)