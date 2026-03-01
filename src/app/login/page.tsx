import Link from 'next/link'
import Image from 'next/image'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Iniciar sesión - Mayand',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const { redirectTo } = await searchParams

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
          <h1 className="text-xl font-bold text-white text-center mb-2">Iniciar sesión</h1>
          <p className="text-sm text-white/40 text-center mb-6">
            Accede a tu cuenta de Mayand
          </p>

          <LoginForm redirectTo={redirectTo} />

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-[#458FFF] hover:text-[#3a7de6] font-medium transition-colors">
                Regístrate
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
