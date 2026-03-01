'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Loader2, Save, ImageIcon, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { uploadProductImage, getProductImageUrl } from '@/lib/storage'

interface LandingSection {
  id: string
  section: string
  slot: string
  title: string | null
  subtitle: string | null
  image_url: string | null
  link_url: string | null
  sort_order: number
  is_active: boolean
}

const TABS = [
  { key: 'hero', label: 'Hero' },
  { key: 'services', label: 'Servicios' },
  { key: 'portfolio', label: 'Portafolio' },
] as const

export default function AdminLandingPage() {
  const [sections, setSections] = useState<LandingSection[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('hero')
  const [editState, setEditState] = useState<Record<string, Partial<LandingSection>>>({})
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/landing')
      if (!res.ok) throw new Error('Error al cargar')
      const data = await res.json()
      setSections(data.sections || [])
    } catch {
      toast.error('Error al cargar secciones')
    }
    setLoading(false)
  }

  useEffect(() => { fetchSections() }, [])

  const filtered = sections.filter(s => s.section === activeTab)

  const getEdited = (s: LandingSection) => ({
    ...s,
    ...editState[s.id],
  })

  const updateField = (id: string, field: string, value: string | boolean) => {
    setEditState(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const handleImageUpload = async (sectionItem: LandingSection, file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de archivo no válido')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Archivo demasiado grande (máx 5MB)')
      return
    }

    setUploadingId(sectionItem.id)
    try {
      const result = await uploadProductImage(file, `landing-${sectionItem.section}-${sectionItem.slot}`)
      if (!result.success) throw new Error(result.error)
      updateField(sectionItem.id, 'image_url', result.data!.path)
      toast.success('Imagen cargada')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir imagen')
    }
    setUploadingId(null)
  }

  const handleSave = async (sectionItem: LandingSection) => {
    const edits = editState[sectionItem.id]
    if (!edits) {
      toast.info('Sin cambios')
      return
    }

    setSavingId(sectionItem.id)
    try {
      const res = await fetch('/api/admin/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sectionItem.id, ...edits }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar')
      }
      const data = await res.json()
      setSections(prev => prev.map(s => s.id === sectionItem.id ? data.section : s))
      setEditState(prev => {
        const next = { ...prev }
        delete next[sectionItem.id]
        return next
      })
      toast.success('Guardado')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    }
    setSavingId(null)
  }

  const inputClass = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#458FFF]" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Landing CMS</h1>
        <p className="text-sm text-white/40">Administra el contenido de la página principal</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-[#458FFF]/15 text-[#458FFF] border border-[#458FFF]/20'
                : 'text-white/40 hover:text-white/60 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map(section => {
          const edited = getEdited(section)
          const hasChanges = !!editState[section.id]
          const isSaving = savingId === section.id
          const isUploading = uploadingId === section.id

          return (
            <div
              key={section.id}
              className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-colors ${
                hasChanges ? 'border-[#458FFF]/30' : 'border-white/[0.06]'
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image preview */}
                <div className="relative w-full sm:w-48 h-40 sm:h-auto bg-white/[0.03] shrink-0">
                  {edited.image_url ? (
                    <Image
                      src={getProductImageUrl(edited.image_url as string)}
                      alt={edited.title || 'Preview'}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={24} className="text-white/10" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-[#458FFF]" />
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">
                      {section.slot.replace(/_/g, ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateField(section.id, 'is_active', !edited.is_active)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        edited.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-white/[0.04] text-white/30 border border-white/[0.08]'
                      }`}
                    >
                      {edited.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                      {edited.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={edited.title || ''}
                      onChange={e => updateField(section.id, 'title', e.target.value)}
                      className={inputClass}
                      placeholder="Título"
                    />
                  </div>

                  {activeTab === 'portfolio' && (
                    <div>
                      <input
                        type="text"
                        value={edited.subtitle || ''}
                        onChange={e => updateField(section.id, 'subtitle', e.target.value)}
                        className={inputClass}
                        placeholder="ID del proyecto (ej: PRINT-990)"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[section.id]?.click()}
                      disabled={isUploading}
                      className="px-3.5 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/50 text-sm hover:border-[#458FFF]/30 hover:text-white/70 transition-all disabled:opacity-40"
                    >
                      Cambiar imagen
                    </button>
                    <input
                      ref={el => { fileInputRefs.current[section.id] = el }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(section, file)
                        e.target.value = ''
                      }}
                    />

                    <div className="flex-1" />

                    <button
                      type="button"
                      onClick={() => handleSave(section)}
                      disabled={!hasChanges || isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#458FFF] hover:bg-[#3a7de6] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-white/30 py-10 text-sm">No hay secciones para este tab</p>
        )}
      </div>
    </div>
  )
}
