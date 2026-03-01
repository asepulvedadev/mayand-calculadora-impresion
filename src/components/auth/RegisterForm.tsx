'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { REGIMENES_FISCALES, USOS_CFDI, ESTADOS_MEXICO } from '@/types/auth'

const STEPS = ['Cuenta', 'Facturación', 'Confirmar']

export function RegisterForm() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Step 1: Account
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  // Step 2: Billing (optional)
  const [rfc, setRfc] = useState('')
  const [razonSocial, setRazonSocial] = useState('')
  const [regimenFiscal, setRegimenFiscal] = useState('')
  const [usoCfdi, setUsoCfdi] = useState('')
  const [calle, setCalle] = useState('')
  const [numExterior, setNumExterior] = useState('')
  const [numInterior, setNumInterior] = useState('')
  const [colonia, setColonia] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [estado, setEstado] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!fullName.trim()) newErrors.fullName = 'Nombre requerido'
    if (!email.trim()) newErrors.email = 'Email requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email inválido'
    if (!password) newErrors.password = 'Contraseña requerida'
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) newErrors.username = 'Solo letras, números y guión bajo'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/.test(rfc.toUpperCase())) {
      newErrors.rfc = 'RFC inválido'
    }
    if (codigoPostal && !/^\d{5}$/.test(codigoPostal)) {
      newErrors.codigoPostal = 'Código postal debe tener 5 dígitos'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return
    if (step === 1 && !validateStep2()) return
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone: phone ? (phone.startsWith('+') ? phone : `+52${phone}`) : undefined,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      // Update profile with extra fields
      if (data.user) {
        const profileUpdate: Record<string, string | null> = {
          username: username || null,
          phone: phone || null,
        }

        // Add billing fields if provided
        if (rfc) profileUpdate.rfc = rfc.toUpperCase()
        if (razonSocial) profileUpdate.razon_social = razonSocial
        if (regimenFiscal) profileUpdate.regimen_fiscal = regimenFiscal
        if (usoCfdi) profileUpdate.uso_cfdi = usoCfdi
        if (calle) profileUpdate.direccion_calle = calle
        if (numExterior) profileUpdate.direccion_numero_exterior = numExterior
        if (numInterior) profileUpdate.direccion_numero_interior = numInterior
        if (colonia) profileUpdate.direccion_colonia = colonia
        if (municipio) profileUpdate.direccion_municipio = municipio
        if (estado) profileUpdate.direccion_estado = estado
        if (codigoPostal) profileUpdate.direccion_codigo_postal = codigoPostal

        await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', data.user.id)
      }

      toast.success('Cuenta creada. Revisa tu email para confirmar.')
      router.push('/login')
    } catch {
      toast.error('Error al crear la cuenta')
    }
    setLoading(false)
  }

  const inputClass = (field?: string) =>
    `w-full px-4 py-3 bg-white/[0.04] border rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#458FFF]/50 focus:ring-1 focus:ring-[#458FFF]/30 transition-all ${
      field && errors[field] ? 'border-red-500/50' : 'border-white/10'
    }`

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
              i < step ? 'bg-green-500 text-white' :
              i === step ? 'bg-[#458FFF] text-white' :
              'bg-white/[0.06] text-white/30'
            }`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${
              i <= step ? 'text-white/70' : 'text-white/30'
            }`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-green-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Account */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Nombre completo *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass('fullName')}
              placeholder="Tu nombre completo"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass('email')}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass('username')}
              placeholder="tu_usuario (opcional)"
            />
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Contraseña *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass('password')} pr-12`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Teléfono</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-white/[0.04] border border-white/10 rounded-xl text-white/40 text-sm">
                +52
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#458FFF]/50 focus:ring-1 focus:ring-[#458FFF]/30 transition-all"
                placeholder="10 dígitos (opcional)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Billing */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-white/40 mb-4">
            Estos datos son opcionales y se usan para facturación. Puedes completarlos después.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-white/60 mb-1.5">RFC</label>
              <input
                type="text"
                value={rfc}
                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                className={inputClass('rfc')}
                placeholder="XAXX010101000"
                maxLength={13}
              />
              {errors.rfc && <p className="mt-1 text-xs text-red-400">{errors.rfc}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-white/60 mb-1.5">Razón Social</label>
              <input
                type="text"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                className={inputClass()}
                placeholder="Empresa S.A. de C.V."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Régimen Fiscal</label>
            <select
              value={regimenFiscal}
              onChange={(e) => setRegimenFiscal(e.target.value)}
              className={inputClass()}
            >
              <option value="" className="bg-[#0a0530]">Seleccionar...</option>
              {REGIMENES_FISCALES.map((r) => (
                <option key={r.value} value={r.value} className="bg-[#0a0530]">{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Uso de CFDI</label>
            <select
              value={usoCfdi}
              onChange={(e) => setUsoCfdi(e.target.value)}
              className={inputClass()}
            >
              <option value="" className="bg-[#0a0530]">Seleccionar...</option>
              {USOS_CFDI.map((u) => (
                <option key={u.value} value={u.value} className="bg-[#0a0530]">{u.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-1.5">Calle</label>
              <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} className={inputClass()} placeholder="Av. Principal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">No. Exterior</label>
              <input type="text" value={numExterior} onChange={(e) => setNumExterior(e.target.value)} className={inputClass()} placeholder="123" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">No. Interior</label>
              <input type="text" value={numInterior} onChange={(e) => setNumInterior(e.target.value)} className={inputClass()} placeholder="4-A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Colonia</label>
              <input type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} className={inputClass()} placeholder="Centro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Municipio</label>
              <input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} className={inputClass()} placeholder="Monterrey" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)} className={inputClass()}>
                <option value="" className="bg-[#0a0530]">Seleccionar...</option>
                {ESTADOS_MEXICO.map((e) => (
                  <option key={e} value={e} className="bg-[#0a0530]">{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">C.P.</label>
              <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                className={inputClass('codigoPostal')}
                placeholder="64000"
                maxLength={5}
              />
              {errors.codigoPostal && <p className="mt-1 text-xs text-red-400">{errors.codigoPostal}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white/80 mb-2">Datos de cuenta</h3>
            <p className="text-sm text-white/60"><span className="text-white/30">Nombre:</span> {fullName}</p>
            <p className="text-sm text-white/60"><span className="text-white/30">Email:</span> {email}</p>
            {username && <p className="text-sm text-white/60"><span className="text-white/30">Usuario:</span> {username}</p>}
            {phone && <p className="text-sm text-white/60"><span className="text-white/30">Teléfono:</span> +52{phone}</p>}
          </div>

          {(rfc || razonSocial) && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white/80 mb-2">Datos de facturación</h3>
              {rfc && <p className="text-sm text-white/60"><span className="text-white/30">RFC:</span> {rfc}</p>}
              {razonSocial && <p className="text-sm text-white/60"><span className="text-white/30">Razón Social:</span> {razonSocial}</p>}
              {regimenFiscal && <p className="text-sm text-white/60"><span className="text-white/30">Régimen:</span> {regimenFiscal}</p>}
              {calle && <p className="text-sm text-white/60"><span className="text-white/30">Dirección:</span> {calle} {numExterior}{numInterior ? ` Int. ${numInterior}` : ''}, {colonia}, {municipio}, {estado} {codigoPostal}</p>}
            </div>
          )}

          <p className="text-xs text-white/30 text-center">
            Recibirás un email de confirmación para activar tu cuenta.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            Anterior
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-[#458FFF] text-white font-bold rounded-xl hover:bg-[#3a7de6] transition-all flex items-center justify-center gap-2"
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            Crear cuenta
          </button>
        )}
      </div>
    </div>
  )
}
