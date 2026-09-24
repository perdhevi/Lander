import React from 'react'
import ReactDOM from 'react-dom'
import './styles/modernist.css'
import './index.css'
import './styles/lander.scss'
import './styles/home.scss'
import Top from './home/Top'
import Bottom from './home/Bottom'

// The Three.js lander (#app in index.html) sits between these two roots,
// so its absolutely-positioned HUD canvases keep working untouched.
ReactDOM.render(<React.StrictMode><Top /></React.StrictMode>, document.getElementById('top'))
ReactDOM.render(<React.StrictMode><Bottom /></React.StrictMode>, document.getElementById('root'))

// When the scene expands to full height on first click, bring it fully into view.
document.querySelector('canvas.webgl')?.addEventListener('click', () => {
  setTimeout(() => document.getElementById('app')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
})
