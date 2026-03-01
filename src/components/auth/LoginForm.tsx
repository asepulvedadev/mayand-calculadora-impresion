'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react'

type LoginTab = 'email' | 'username' | 'phone'

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [activeTab, setActiveTab] = useState<LoginTab>('email')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loginWithEmail = async (resolvedEmail: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    })
    if (error) {
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'Credenciales incorrectas'
          : error.message
      )
      return false
    }
    toast.success('Sesión iniciada')
    router.push(redirectTo || '/')
    router.refresh()
    return true
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await loginWithEmail(email)
    setLoading(false)
  }

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/resolve-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Usuario no encontrado')
        setLoading(false)
        return
      }
      await loginWithEmail(data.email)
    } catch {
      toast.error('Error al iniciar sesión')
    }
    setLoading(false)
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/resolve-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Teléfono no registrado')
        setLoading(false)
        return
      }
      await loginWithEmail(data.email)
    } catch {
      toast.error('Error al iniciar sesión')
    }
    setLoading(false)
  }

  const tabs: { key: LoginTab; label: string; icon: React.ReactNode }[] = [
    { key: 'email', label: 'Email', icon: <Mail size={16} /> },
    { key: 'username', label: 'Usuario', icon: <User size={16} /> },
    { key: 'phone', label: 'Teléfono', icon: <Phone size={16} /> },
  ]

  const inputClass = 'w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#458FFF]/50 focus:ring-1 focus:ring-[#458FFF]/30 transition-all'

  const PasswordField = () => (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">Contraseña</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClass} pr-12`}
          placeholder="Tu contraseña"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )

  const SubmitButton = () => (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-[#458FFF] text-white font-bold rounded-xl hover:bg-[#3a7de6] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      Iniciar sesión
    </button>
  )

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-[#458FFF] text-white shadow-lg shadow-[#458FFF]/20'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Email login */}
      {activeTab === 'email' && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="tu@email.com"
            />
          </div>
          <PasswordField />
          <SubmitButton />
        </form>
      )}

      {/* Username login */}
      {activeTab === 'username' && (
        <form onSubmit={handleUsernameLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Nombre de usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              placeholder="tu_usuario"
            />
          </div>
          <PasswordField />
          <SubmitButton />
        </form>
      )}

      {/* Phone + password login */}
      {activeTab === 'phone' && (
        <form onSubmit={handlePhoneLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Teléfono</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-white/[0.04] border border-white/10 rounded-xl text-white/40 text-sm">
                +52
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`flex-1 ${inputClass}`}
                placeholder="10 dígitos"
              />
            </div>
          </div>
          <PasswordField />
          <SubmitButton />
        </form>
      )}
    </div>
  )
}
