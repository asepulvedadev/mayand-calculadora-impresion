'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { LogOut, User, Shield, ArrowRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export function AuthButton() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return <div className="w-9 h-9 rounded-xl bg-white/[0.06] animate-pulse" />
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="group relative flex items-center gap-2 px-4 py-2 bg-white text-[#080422] text-sm font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-white/10 active:scale-[0.97]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <User size={15} className="text-[#080422]/70 transition-transform duration-300 group-hover:scale-110" />
        <span className="hidden sm:inline tracking-wide">Iniciar sesion</span>
        <ArrowRight size={14} className="text-[#080422]/40 transition-transform duration-300 group-hover:translate-x-0.5" />
        {/* Shimmer */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#458FFF]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    )
  }

  const avatarUrl = profile?.avatar_url
  const displayName = profile?.full_name || profile?.username || user.email?.split('@')[0] || 'Usuario'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2.5 p-1 pr-2 rounded-xl transition-all duration-200 ${
          open ? 'bg-white/10' : 'hover:bg-white/[0.06]'
        }`}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={34}
            height={34}
            className="w-[34px] h-[34px] rounded-lg object-cover border border-white/10"
          />
        ) : (
          <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[#458FFF] to-[#6C5CE7] flex items-center justify-center text-white text-sm font-bold shadow-inner">
            {initials}
          </div>
        )}
        {/* Expand chevron */}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          className={`text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-60 bg-[#0c0638] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 transition-all duration-200 origin-top-right ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* User info */}
        <div className="px-4 py-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={36}
                height={36}
                className="w-9 h-9 rounded-lg object-cover border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#458FFF] to-[#6C5CE7] flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-[11px] text-white/35 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1.5">
          <button
            onClick={() => { setOpen(false); router.push('/perfil') }}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-[#458FFF]/15 flex items-center justify-center transition-colors">
              <User size={15} className="group-hover:text-[#458FFF] transition-colors" />
            </div>
            Mi Perfil
          </button>

          {profile?.role === 'admin' && (
            <button
              onClick={() => { setOpen(false); router.push('/admin') }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-amber-500/15 flex items-center justify-center transition-colors">
                <Shield size={15} className="group-hover:text-amber-400 transition-colors" />
              </div>
              Admin Panel
            </button>
          )}
        </div>

        {/* Logout */}
        <div className="border-t border-white/[0.06] p-1.5">
          <button
            onClick={async () => {
              setOpen(false)
              await signOut()
              router.push('/')
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-white/55 hover:text-red-400 hover:bg-red-500/[0.06] rounded-xl transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-red-500/15 flex items-center justify-center transition-colors">
              <LogOut size={15} className="group-hover:text-red-400 transition-colors" />
            </div>
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  )
}
