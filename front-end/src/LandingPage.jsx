import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <header className="lp-header">
        <h1> Welcome to LocationSearch</h1>
        <p>
          A simple app to search for locations close to you! 
          Login below to view our map or signup if you don't have an account already!
        </p>
      </header>
      <main>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/login')}>Signup</button>
      </main>
    </div>
  )
}

export default LandingPage