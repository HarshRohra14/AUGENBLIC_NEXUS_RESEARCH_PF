import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'register') {
        await api.register({ name: form.name, email: form.email, password: form.password })
      }
      await login(form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A000F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-wider text-[#A855F7]">NEXUS</h1>
          <p className="text-gray-400 text-sm mt-2">Research Intelligence Platform</p>
        </div>

        {/* Card */}
        <div className="bg-[#150825] rounded-2xl p-8 border border-white/5 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#0A000F] rounded-xl p-1 mb-8">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null) }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  mode === m ? 'bg-[#A855F7] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. Sarah Chen"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-[#0A000F] text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:border-[#A855F7]/50 focus:outline-none transition-colors placeholder:text-gray-600"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="demo@nexus.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-[#0A000F] text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:border-[#A855F7]/50 focus:outline-none transition-colors placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full bg-[#0A000F] text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:border-[#A855F7]/50 focus:outline-none transition-colors placeholder:text-gray-600"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A855F7] hover:bg-[#A855F7]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-colors mt-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-gray-500 mt-6">
              Demo credentials: <span className="text-gray-300">demo@nexus.com</span> / <span className="text-gray-300">demo1234</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
