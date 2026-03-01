import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { username, phone } = await request.json()

    if (!username && !phone) {
      return NextResponse.json({ error: 'Username o teléfono requerido' }, { status: 400 })
    }

    const supabase = createAdminClient()

    let profileId = ''

    if (phone) {
      // Normalize phone: strip +52, spaces, dashes
      const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^52/, '')

      // Search by phone in profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', cleanPhone)
        .single()

      if (error || !profile) {
        return NextResponse.json({ error: 'Teléfono no registrado' }, { status: 404 })
      }
      profileId = profile.id
    } else {
      // Search by username
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (error || !profile) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }
      profileId = profile.id
    }

    // Get email from auth.users via admin API
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profileId)

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ email: userData.user.email })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
