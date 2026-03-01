import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' ? user : null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const adminUser = await checkAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const admin = createAdminClient()

  const { data: profile, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const { data: userData } = await admin.auth.admin.getUserById(id)

  return NextResponse.json({
    ...profile,
    email: userData.user?.email || '',
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const adminUser = await checkAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await request.json()
  const admin = createAdminClient()

  // Update profile
  const { role, full_name, username, phone, email, password, ...rest } = body

  const profileUpdate: Record<string, unknown> = {}
  if (role !== undefined) profileUpdate.role = role
  if (full_name !== undefined) profileUpdate.full_name = full_name
  if (username !== undefined) profileUpdate.username = username || null
  if (phone !== undefined) profileUpdate.phone = phone || null
  Object.assign(profileUpdate, rest)

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await admin
      .from('profiles')
      .update(profileUpdate)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }

  // Update auth user if email or password changed
  const authUpdate: Record<string, string> = {}
  if (email) authUpdate.email = email
  if (password) authUpdate.password = password

  if (Object.keys(authUpdate).length > 0) {
    const { error } = await admin.auth.admin.updateUserById(id, authUpdate)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const adminUser = await checkAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Prevent self-deletion
  if (adminUser.id === id) {
    return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
