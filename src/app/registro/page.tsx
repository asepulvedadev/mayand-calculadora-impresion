import Link from 'next/link'
import Image from 'next/image'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Registro - Mayand',
}

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-[#080422] to-[#110363]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/LOGO_LIGHT.svg" alt="Mayand" width={140} height={40} className="h-8 w-auto" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white text-center mb-2">Crear cuenta</h1>
          <p className="text-sm text-white/40 text-center mb-6">
            Regístrate en Mayand
          </p>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#458FFF] hover:text-[#3a7de6] font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/30 hover:text-white/50 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
