'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, X, Save, Eye, EyeOff } from 'lucide-react'
import type { ProfileWithUser, UserRole } from '@/types/auth'
import { REGIMENES_FISCALES, USOS_CFDI, ESTADOS_MEXICO } from '@/types/auth'

interface UserFormProps {
  user: ProfileWithUser | null
  onClose: (saved?: boolean) => void
}

const TABS = [
  { key: 'cuenta', label: 'Cuenta' },
  { key: 'facturacion', label: 'Facturación' },
  { key: 'direccion', label: 'Dirección' },
] as const

type TabKey = typeof TABS[number]['key']

export function UserForm({ user, onClose }: UserFormProps) {
  const isEditing = !!user
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('cuenta')
  const [showPassword, setShowPassword] = useState(false)

  // Cuenta
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [role, setRole] = useState<UserRole>(user?.role || 'user')

  // Facturación
  const [rfc, setRfc] = useState(user?.rfc || '')
  const [razonSocial, setRazonSocial] = useState(user?.razon_social || '')
  const [regimenFiscal, setRegimenFiscal] = useState(user?.regimen_fiscal || '')
  const [usoCfdi, setUsoCfdi] = useState(user?.uso_cfdi || '')

  // Dirección
  const [calle, setCalle] = useState(user?.direccion_calle || '')
  const [numExterior, setNumExterior] = useState(user?.direccion_numero_exterior || '')
  const [numInterior, setNumInterior] = useState(user?.direccion_numero_interior || '')
  const [colonia, setColonia] = useState(user?.direccion_colonia || '')
  const [municipio, setMunicipio] = useState(user?.direccion_municipio || '')
  const [estado, setEstado] = useState(user?.direccion_estado || '')
  const [codigoPostal, setCodigoPostal] = useState(user?.direccion_codigo_postal || '')
  const [pais, setPais] = useState(user?.direccion_pais || 'México')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const body: Record<string, string | null> = {
        full_name: fullName,
        username,
        phone,
        role,
        // Facturación
        rfc: rfc || null,
        razon_social: razonSocial || null,
        regimen_fiscal: regimenFiscal || null,
        uso_cfdi: usoCfdi || null,
        // Dirección
        direccion_calle: calle || null,
        direccion_numero_exterior: numExterior || null,
        direccion_numero_interior: numInterior || null,
        direccion_colonia: colonia || null,
        direccion_municipio: municipio || null,
        direccion_estado: estado || null,
        direccion_codigo_postal: codigoPostal || null,
        direccion_pais: pais || null,
      }

      if (!isEditing) {
        body.email = email
        body.password = password
      } else {
        if (email !== user?.email) body.email = email
        if (password) body.password = password
      }

      const url = isEditing ? `/api/admin/users/${user.id}` : '/api/admin/users'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar')
      }

      toast.success(isEditing ? 'Usuario actualizado' : 'Usuario creado')
      onClose(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    }
    setLoading(false)
  }

  const inputClass = 'w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#458FFF]/50 focus:ring-1 focus:ring-[#458FFF]/30 transition-all'
  const labelClass = 'block text-sm font-medium text-white/60 mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onClose()} />
      <div className="relative bg-[#0a0530] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0a0530] rounded-t-2xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            <button onClick={() => onClose()} className="p-2 text-white/30 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pb-3">
            {TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#458FFF]/15 text-[#458FFF] border border-[#458FFF]/20'
                    : 'text-white/40 hover:text-white/60 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tab: Cuenta */}
          {activeTab === 'cuenta' && (
            <>
              <div>
                <label className={labelClass}>Nombre completo</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Nombre completo" />
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="usuario@email.com" />
              </div>

              <div>
                <label className={labelClass}>
                  Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isEditing}
                    className={`${inputClass} pr-10`}
                    placeholder={isEditing ? 'Sin cambios' : 'Mínimo 6 caracteres'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="username" />
                </div>
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+52..." />
                </div>
              </div>

              <div>
                <label className={labelClass}>Rol</label>
                <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={inputClass}>
                  <option value="user" className="bg-[#0a0530]">Usuario</option>
                  <option value="admin" className="bg-[#0a0530]">Administrador</option>
                </select>
              </div>
            </>
          )}

          {/* Tab: Facturación */}
          {activeTab === 'facturacion' && (
            <>
              <div>
                <label className={labelClass}>RFC</label>
                <input
                  type="text"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="XAXX010101000"
                  maxLength={13}
                />
              </div>

              <div>
                <label className={labelClass}>Razón Social</label>
                <input
                  type="text"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  className={inputClass}
                  placeholder="Nombre o razón social"
                />
              </div>

              <div>
                <label className={labelClass}>Régimen Fiscal</label>
                <select value={regimenFiscal} onChange={(e) => setRegimenFiscal(e.target.value)} className={inputClass}>
                  <option value="" className="bg-[#0a0530]">Seleccionar</option>
                  {REGIMENES_FISCALES.map(r => (
                    <option key={r.value} value={r.value} className="bg-[#0a0530]">{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Uso CFDI</label>
                <select value={usoCfdi} onChange={(e) => setUsoCfdi(e.target.value)} className={inputClass}>
                  <option value="" className="bg-[#0a0530]">Seleccionar</option>
                  {USOS_CFDI.map(u => (
                    <option key={u.value} value={u.value} className="bg-[#0a0530]">{u.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Tab: Dirección */}
          {activeTab === 'direccion' && (
            <>
              <div>
                <label className={labelClass}>Calle</label>
                <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} className={inputClass} placeholder="Calle" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Num. Exterior</label>
                  <input type="text" value={numExterior} onChange={(e) => setNumExterior(e.target.value)} className={inputClass} placeholder="123" />
                </div>
                <div>
                  <label className={labelClass}>Num. Interior</label>
                  <input type="text" value={numInterior} onChange={(e) => setNumInterior(e.target.value)} className={inputClass} placeholder="A" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Colonia</label>
                  <input type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} className={inputClass} placeholder="Colonia" />
                </div>
                <div>
                  <label className={labelClass}>Municipio</label>
                  <input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} className={inputClass} placeholder="Municipio" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Estado</label>
                  <select value={estado} onChange={(e) => setEstado(e.target.value)} className={inputClass}>
                    <option value="" className="bg-[#0a0530]">Seleccionar</option>
                    {ESTADOS_MEXICO.map(e => (
                      <option key={e} value={e} className="bg-[#0a0530]">{e}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Código Postal</label>
                  <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className={inputClass} placeholder="64000" maxLength={5} />
                </div>
              </div>

              <div>
                <label className={labelClass}>País</label>
                <input type="text" value={pais} onChange={(e) => setPais(e.target.value)} className={inputClass} placeholder="México" />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 py-3 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/[0.04] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#458FFF] text-white font-bold rounded-xl hover:bg-[#3a7de6] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isEditing ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
