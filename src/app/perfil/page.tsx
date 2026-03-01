import Link from 'next/link'
import Image from 'next/image'
import { ProfileForm } from '@/components/auth/ProfileForm'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Mi Perfil - Mayand',
}

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080422] to-[#110363]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#080422]/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <Link href="/">
              <Image src="/LOGO_LIGHT.svg" alt="Mayand" width={100} height={32} className="h-6 w-auto" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Mi Perfil</h1>
        <ProfileForm />
      </main>
    </div>
  )
}
