import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Obtener producto
    const { data: product, error } = await supabase
      .from('catalog_products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Obtener categoría
    const { data: category } = await supabase
      .from('catalog_categories')
      .select('id, name, slug, category_type, color')
      .eq('id', product.category_id)
      .single()

    // Obtener material
    const { data: material } = await supabase
      .from('catalog_materials')
      .select('id, name, slug')
      .eq('id', product.material_id)
      .single()

    // Obtener imágenes
    const { data: images } = await supabase
      .from('catalog_product_images')
      .select('*')
      .eq('product_id', id)
      .order('sort_order')

    // Obtener tags
    const { data: productTags } = await supabase
      .from('catalog_product_tags')
      .select('tag_id')
      .eq('product_id', id)

    let tags: any[] = []
    if (productTags && productTags.length > 0) {
      const tagIds = productTags.map(pt => pt.tag_id)
      const { data: tagData } = await supabase
        .from('catalog_tags')
        .select('*')
        .in('id', tagIds)
      tags = tagData || []
    }

    return NextResponse.json({ 
      product: {
        ...product,
        category,
        material,
        images,
        tags
      } 
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Extraer tags e imágenes si existen
    const { tags, images, ...productData } = body

    // Actualizar producto
    const { data: product, error } = await supabase
      .from('catalog_products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Actualizar imágenes si se proporcionan
    if (images !== undefined) {
      // Eliminar imágenes existentes
      await supabase
        .from('catalog_product_images')
        .delete()
        .eq('product_id', id)

      // Insertar nuevas imágenes
      if (images.length > 0) {
        const imageInserts = images.map((url: string, index: number) => ({
          product_id: id,
          url,
          sort_order: index
        }))

        await supabase
          .from('catalog_product_images')
          .insert(imageInserts)
      }
    }

    // Actualizar tags si se proporcionan
    if (tags !== undefined) {
      // Eliminar relaciones existentes
      await supabase
        .from('catalog_product_tags')
        .delete()
        .eq('product_id', id)

      // Insertar nuevas relaciones
      if (tags.length > 0) {
        const tagRelations = tags.map((tagId: string) => ({
          product_id: id,
          tag_id: tagId
        }))

        await supabase
          .from('catalog_product_tags')
          .insert(tagRelations)
      }
    }

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { error } = await supabase
      .from('catalog_products')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Producto eliminado' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
