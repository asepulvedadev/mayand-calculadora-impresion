'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { toast } from 'sonner'
import { Loader2, Camera, Save, Lock } from 'lucide-react'
import { REGIMENES_FISCALES, USOS_CFDI, ESTADOS_MEXICO } from '@/types/auth'
import Image from 'next/image'

type Tab = 'cuenta' | 'facturacion' | 'seguridad'

export function ProfileForm() {
  const { user, profile, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('cuenta')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Account fields
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [phone, setPhone] = useState(profile?.phone || '')

  // Billing fields
  const [rfc, setRfc] = useState(profile?.rfc || '')
  const [razonSocial, setRazonSocial] = useState(profile?.razon_social || '')
  const [regimenFiscal, setRegimenFiscal] = useState(profile?.regimen_fiscal || '')
  const [usoCfdi, setUsoCfdi] = useState(profile?.uso_cfdi || '')
  const [calle, setCalle] = useState(profile?.direccion_calle || '')
  const [numExterior, setNumExterior] = useState(profile?.direccion_numero_exterior || '')
  const [numInterior, setNumInterior] = useState(profile?.direccion_numero_interior || '')
  const [colonia, setColonia] = useState(profile?.direccion_colonia || '')
  const [municipio, setMunicipio] = useState(profile?.direccion_municipio || '')
  const [estado, setEstado] = useState(profile?.direccion_estado || '')
  const [codigoPostal, setCodigoPostal] = useState(profile?.direccion_codigo_postal || '')

  // Security fields
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no puede pesar más de 2MB')
      return
    }

    setLoading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      toast.error('Error al subir imagen')
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', user.id)

    if (updateError) {
      toast.error('Error al actualizar perfil')
    } else {
      toast.success('Avatar actualizado')
      await refreshProfile()
    }
    setLoading(false)
  }

  const handleSaveAccount = async () => {
    if (!user) return
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName || null,
        username: username || null,
        phone: phone || null,
      })
      .eq('id', user.id)

    if (error) {
      if (error.code === '23505') {
        toast.error('Ese nombre de usuario ya está en uso')
      } else {
        toast.error('Error al guardar')
      }
    } else {
      toast.success('Perfil actualizado')
      await refreshProfile()
    }
    setLoading(false)
  }

  const handleSaveBilling = async () => {
    if (!user) return
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        rfc: rfc.toUpperCase() || null,
        razon_social: razonSocial || null,
        regimen_fiscal: regimenFiscal || null,
        uso_cfdi: usoCfdi || null,
        direccion_calle: calle || null,
        direccion_numero_exterior: numExterior || null,
        direccion_numero_interior: numInterior || null,
        direccion_colonia: colonia || null,
        direccion_municipio: municipio || null,
        direccion_estado: estado || null,
        direccion_codigo_postal: codigoPostal || null,
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Error al guardar')
    } else {
      toast.success('Datos de facturación actualizados')
      await refreshProfile()
    }
    setLoading(false)
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Contraseña actualizada')
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  const inputClass = 'w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#458FFF]/50 focus:ring-1 focus:ring-[#458FFF]/30 transition-all'

  const tabs: { key: Tab; label: string }[] = [
    { key: 'cuenta', label: 'Mi Cuenta' },
    { key: 'facturacion', label: 'Facturación' },
    { key: 'seguridad', label: 'Seguridad' },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative group">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={72}
              height={72}
              className="w-[72px] h-[72px] rounded-full object-cover border-2 border-white/10"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-[#458FFF]/20 border-2 border-[#458FFF]/30 flex items-center justify-center text-[#458FFF] text-2xl font-bold">
              {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera size={20} className="text-white" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{profile?.full_name || 'Sin nombre'}</h2>
          <p className="text-sm text-white/40">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-[#458FFF] text-white shadow-lg shadow-[#458FFF]/20'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account tab */}
      {activeTab === 'cuenta' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Nombre completo</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Tu nombre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Nombre de usuario</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="tu_usuario" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Teléfono</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+52 10 dígitos" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
            <input type="email" value={user?.email || ''} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
          </div>
          <button
            onClick={handleSaveAccount}
            disabled={loading}
            className="w-full py-3 bg-[#458FFF] text-white font-bold rounded-xl hover:bg-[#3a7de6] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Guardar cambios
          </button>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === 'facturacion' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">RFC</label>
              <input type="text" value={rfc} onChange={(e) => setRfc(e.target.value.toUpperCase())} className={inputClass} placeholder="XAXX010101000" maxLength={13} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Razón Social</label>
              <input type="text" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} className={inputClass} placeholder="Empresa S.A. de C.V." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Régimen Fiscal</label>
            <select value={regimenFiscal} onChange={(e) => setRegimenFiscal(e.target.value)} className={inputClass}>
              <option value="" className="bg-[#0a0530]">Seleccionar...</option>
              {REGIMENES_FISCALES.map((r) => (
                <option key={r.value} value={r.value} className="bg-[#0a0530]">{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Uso de CFDI</label>
            <select value={usoCfdi} onChange={(e) => setUsoCfdi(e.target.value)} className={inputClass}>
              <option value="" className="bg-[#0a0530]">Seleccionar...</option>
              {USOS_CFDI.map((u) => (
                <option key={u.value} value={u.value} className="bg-[#0a0530]">{u.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-1.5">Calle</label>
              <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} className={inputClass} placeholder="Av. Principal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">No. Exterior</label>
              <input type="text" value={numExterior} onChange={(e) => setNumExterior(e.target.value)} className={inputClass} placeholder="123" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">No. Interior</label>
              <input type="text" value={numInterior} onChange={(e) => setNumInterior(e.target.value)} className={inputClass} placeholder="4-A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Colonia</label>
              <input type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} className={inputClass} placeholder="Centro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Municipio</label>
              <input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} className={inputClass} placeholder="Monterrey" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)} className={inputClass}>
                <option value="" className="bg-[#0a0530]">Seleccionar...</option>
                {ESTADOS_MEXICO.map((e) => (
                  <option key={e} value={e} className="bg-[#0a0530]">{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">C.P.</label>
              <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className={inputClass} placeholder="64000" maxLength={5} />
            </div>
          </div>
          <button
            onClick={handleSaveBilling}
            disabled={loading}
            className="w-full py-3 bg-[#458FFF] text-white font-bold rounded-xl hover:bg-[#3a7de6] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Guardar facturación
          </button>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'seguridad' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Repite la contraseña"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={loading || !newPassword}
            className="w-full py-3 bg-[#458FFF] text-white font-bold rounded-xl hover:bg-[#3a7de6] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            Cambiar contraseña
          </button>
        </div>
      )}
    </div>
  )
}
