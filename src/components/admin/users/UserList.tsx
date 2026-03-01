'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Plus, Pencil, Trash2, Shield, User, Phone, FileText, Calendar } from 'lucide-react'
import type { ProfileWithUser } from '@/types/auth'
import { UserForm } from './UserForm'
import Image from 'next/image'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function UserList() {
  const [users, setUsers] = useState<ProfileWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<ProfileWithUser | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Error al cargar usuarios')
      const data = await res.json()
      setUsers(data)
    } catch {
      toast.error('Error al cargar usuarios')
    }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (user: ProfileWithUser) => {
    if (!confirm(`¿Eliminar a ${user.full_name || user.email}?`)) return

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      toast.success('Usuario eliminado')
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const handleFormClose = (saved?: boolean) => {
    setShowForm(false)
    setEditingUser(null)
    if (saved) fetchUsers()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#458FFF]" />
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Usuarios ({users.length})</h2>
          <p className="text-sm text-white/40">Gestiona los usuarios del sistema</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#458FFF] text-white text-sm font-bold rounded-xl hover:bg-[#3a7de6] transition-colors"
        >
          <Plus size={16} />
          Nuevo usuario
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Teléfono</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">RFC</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Registro</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <Image src={u.avatar_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#458FFF]/20 flex items-center justify-center text-[#458FFF] text-xs font-bold">
                          {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{u.full_name || 'Sin nombre'}</p>
                        {u.username && <p className="text-xs text-white/30">@{u.username}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-white/40">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                      u.role === 'admin'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        : 'bg-white/[0.06] text-white/40 border border-white/10'
                    }`}>
                      {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                      {u.role === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.rfc ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        <FileText size={10} />
                        RFC
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/[0.04] text-white/25 border border-white/[0.06]">
                        Sin RFC
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/30">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditingUser(u); setShowForm(true) }}
                        className="p-2 text-white/30 hover:text-[#458FFF] hover:bg-[#458FFF]/10 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((u) => (
          <div key={u.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {u.avatar_url ? (
                  <Image src={u.avatar_url} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#458FFF]/20 flex items-center justify-center text-[#458FFF] text-sm font-bold">
                    {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">{u.full_name || 'Sin nombre'}</p>
                  {u.username && <p className="text-xs text-white/30">@{u.username}</p>}
                </div>
              </div>

              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                u.role === 'admin'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'bg-white/[0.06] text-white/40 border border-white/10'
              }`}>
                {u.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                {u.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              <p className="text-xs text-white/50">{u.email}</p>
              {u.phone && (
                <p className="text-xs text-white/40 flex items-center gap-1.5">
                  <Phone size={10} className="text-white/25" />
                  {u.phone}
                </p>
              )}
              <div className="flex items-center gap-2">
                {u.rfc ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    <FileText size={10} />
                    RFC
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/[0.04] text-white/25 border border-white/[0.06]">
                    Sin RFC
                  </span>
                )}
                <span className="text-[10px] text-white/25 flex items-center gap-1">
                  <Calendar size={10} />
                  {formatDate(u.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-2.5 border-t border-white/[0.06]">
              <button
                onClick={() => { setEditingUser(u); setShowForm(true) }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-white/40 hover:text-[#458FFF] hover:bg-[#458FFF]/10 rounded-lg transition-colors"
              >
                <Pencil size={12} />
                Editar
              </button>
              <button
                onClick={() => handleDelete(u)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={12} />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <UserForm user={editingUser} onClose={handleFormClose} />
      )}
    </>
  )
}
