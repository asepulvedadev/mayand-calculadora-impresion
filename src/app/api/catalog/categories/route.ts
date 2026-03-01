import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CategoryType } from '@/types'

// GET - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as CategoryType | null
    const active = searchParams.get('active')

    let query = supabase
      .from('catalog_categories')
      .select('id, name, slug, icon, sort_order, is_active, color, image_url')
      .order('sort_order')

    if (type) {
      query = query.eq('category_type', type)
    }
    if (active === 'true') {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

// POST - Crear categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generar slug si no se proporciona
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    const { data, error } = await supabase
      .from('catalog_categories')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
