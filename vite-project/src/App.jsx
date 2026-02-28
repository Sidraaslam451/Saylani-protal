import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.jsx'
import LostFound from './LostFound'

function App() {
  const [session, setSession] = useState(null)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Naya State: Taake hum Dashboard aur Modules ke darmiyan switch kar saken
  const [activeView, setActiveView] = useState('dashboard')

  // 1. Check User Session on Load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Authentication Logic
  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for verification link!')
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setActiveView('dashboard') // Logout par reset
  }

  // --- DASHBOARD VIEW ---
  if (session) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-[#0057a8] p-4 text-white flex justify-between items-center shadow-md border-b-4 border-[#66b032]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0057a8] font-bold italic">S</div>
            <h1 className="text-xl font-bold">Saylani IT Hub</h1>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Logout
          </button>
        </nav>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto p-8">
          
          {/* Back Button: Sirf tab dikhega jab hum module ke andar honge */}
          {activeView !== 'dashboard' && (
            <button 
              onClick={() => setActiveView('dashboard')}
              className="mb-6 text-[#0057a8] font-bold flex items-center gap-2 hover:underline"
            >
              ← Back to Dashboard
            </button>
          )}

          {/* Conditional Rendering: Switch between Dashboard and Modules */}
          {activeView === 'dashboard' ? (
            <>
              <header className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back! 👋</h2>
                <p className="text-gray-500">Student Portal: Manage your campus activities.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Lost & Found - CLICKABLE */}
                <div 
                  onClick={() => setActiveView('lostfound')}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#66b032] transition-colors">
                    <span className="text-2xl group-hover:grayscale-0">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0057a8]">Lost & Found</h3>
                  <p className="text-gray-600 mt-2">Post items you found or lost in campus.</p>
                  <button className="mt-4 text-[#66b032] font-semibold hover:underline">Open Module →</button>
                </div>

                {/* Card 2: Complaints */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0057a8] transition-colors">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0057a8]">Complaints</h3>
                  <p className="text-gray-600 mt-2">File complaints for IT, Water, or Power.</p>
                  <button className="mt-4 text-[#66b032] font-semibold hover:underline">Open Module →</button>
                </div>

                {/* Card 3: Volunteers */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0057a8]">Volunteers</h3>
                  <p className="text-gray-600 mt-2">Sign up for Saylani Welfare events.</p>
                  <button className="mt-4 text-[#66b032] font-semibold hover:underline">Open Module →</button>
                </div>
              </div>
            </>
          ) : activeView === 'lostfound' ? (
            // Yahan hum session pass kar rahe hain LostFound component ko
            <LostFound session={session} />
          ) : (
            <div className="text-center p-20 bg-white rounded-2xl shadow">
               <h2 className="text-xl font-bold text-gray-400">This module is under construction...</h2>
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- LOGIN/SIGNUP VIEW ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-md w-full border-t-8 border-[#66b032]">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#0057a8] text-center mb-2">Saylani IT Hub</h1>
          <p className="text-center text-gray-500 mb-8 font-medium italic">Empowering Youth</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0057a8]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0057a8]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0057a8] text-white p-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-4 text-sm text-[#66b032] font-bold hover:underline"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App