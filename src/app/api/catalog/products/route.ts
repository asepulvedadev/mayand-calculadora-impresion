import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')
    const tag = searchParams.get('tag')

    let query = supabase
      .from('catalog_products')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category_id', category)
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    if (active === 'true') {
      query = query.eq('is_active', true)
    }

    const { data: products, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener categorías y materiales relacionados
    const { data: categories } = await supabase
      .from('catalog_categories')
      .select('id, name, slug')

    const { data: materials } = await supabase
      .from('catalog_materials')
      .select('id, name, slug')

    // Obtener imágenes
    const { data: allImages } = await supabase
      .from('catalog_product_images')
      .select('*')

    // Obtener tags
    const { data: allTags } = await supabase
      .from('catalog_tags')
      .select('*')

    const { data: productTags } = await supabase
      .from('catalog_product_tags')
      .select('*')

    // Enriquecer productos con relaciones
    const enrichedProducts = products?.map(product => {
      const category = categories?.find(c => c.id === product.category_id)
      const material = materials?.find(m => m.id === product.material_id)
      const images = allImages?.filter(img => img.product_id === product.id) || []
      const tagRelations = productTags?.filter(pt => pt.product_id === product.id) || []
      const tags = tagRelations
        .map(pt => allTags?.find(t => t.id === pt.tag_id))
        .filter(Boolean)

      return {
        ...product,
        category: category || null,
        material: material || null,
        images,
        tags
      }
    }) || []

    // Filtrar por tag si se especifica
    let filteredProducts = enrichedProducts
    if (tag) {
      filteredProducts = enrichedProducts.filter((p: any) =>
        p.tags?.some((t: any) => t.slug === tag)
      )
    }

    return NextResponse.json({ products: filteredProducts })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Extraer tags e imágenes si existen
    const { tags, images, ...productData } = body

    // Generar slug si no existe
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Insertar producto
    const { data: product, error } = await supabase
      .from('catalog_products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Insertar imágenes si existen
    if (images && images.length > 0) {
      const imageInserts = images.map((url: string, index: number) => ({
        product_id: product.id,
        url,
        sort_order: index
      }))

      await supabase
        .from('catalog_product_images')
        .insert(imageInserts)
    }

    // Insertar relaciones de tags si existen
    if (tags && tags.length > 0) {
      const tagRelations = tags.map((tagId: string) => ({
        product_id: product.id,
        tag_id: tagId
      }))

      await supabase
        .from('catalog_product_tags')
        .insert(tagRelations)
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
