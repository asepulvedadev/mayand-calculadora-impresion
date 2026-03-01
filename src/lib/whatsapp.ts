import type { CartItem } from '@/lib/cart/CartContext'
import type { Profile } from '@/types/auth'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '528140076026'

function getDate() {
  return new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function pad(label: string, minLen = 14): string {
  return label.padEnd(minLen, ' ')
}

function buildClientBlock(profile: Profile | null, email?: string): string {
  if (!profile) {
    return [
      '┃ Cliente: _Sin registro_',
      '┃ Requiere factura: No',
    ].join('\n')
  }

  const lines: string[] = []

  lines.push(`┃ ${pad('Nombre:')} ${profile.full_name || '—'}`)
  if (email) lines.push(`┃ ${pad('Email:')} ${email}`)
  if (profile.phone) lines.push(`┃ ${pad('Teléfono:')} ${profile.phone}`)

  if (profile.rfc) {
    lines.push('┃')
    lines.push('┃ 🧾 *Datos de facturación*')
    lines.push(`┃ ${pad('RFC:')} ${profile.rfc}`)
    if (profile.razon_social) lines.push(`┃ ${pad('Razón social:')} ${profile.razon_social}`)
    if (profile.regimen_fiscal) lines.push(`┃ ${pad('Régimen:')} ${profile.regimen_fiscal}`)
    if (profile.uso_cfdi) lines.push(`┃ ${pad('Uso CFDI:')} ${profile.uso_cfdi}`)

    const street = [
      profile.direccion_calle,
      profile.direccion_numero_exterior ? `#${profile.direccion_numero_exterior}` : null,
      profile.direccion_numero_interior ? `Int. ${profile.direccion_numero_interior}` : null,
    ].filter(Boolean).join(' ')

    const locality = [
      profile.direccion_colonia ? `Col. ${profile.direccion_colonia}` : null,
      profile.direccion_municipio,
      profile.direccion_estado,
      profile.direccion_codigo_postal ? `C.P. ${profile.direccion_codigo_postal}` : null,
    ].filter(Boolean).join(', ')

    if (street) lines.push(`┃ ${pad('Dirección:')} ${street}`)
    if (locality) lines.push(`┃ ${' '.repeat(14)} ${locality}`)
  } else {
    lines.push('┃ Requiere factura: _Por confirmar_')
  }

  return lines.join('\n')
}

/** Single product — quote request sent by client */
export function buildProductWhatsAppUrl(
  product: { name: string; price: number; price_unit?: string; category_name?: string; dimensions?: string; material_name?: string },
  profile: Profile | null,
  email?: string,
): string {
  const lines: string[] = [
    'Hola Mayand, solicito cotización:',
    '',
    '┏━━━━━━━━━━━━━━━━━━━━━━━━┓',
    '┃  📋 *SOLICITUD DE COTIZACIÓN*',
    '┃  Mayand Gran Formato',
    '┣━━━━━━━━━━━━━━━━━━━━━━━━┫',
    `┃ Fecha: ${getDate()}`,
    '┣━━━━━━━━━━━━━━━━━━━━━━━━┫',
    '┃ 👤 *Datos del solicitante*',
    buildClientBlock(profile, email),
    '┣━━━━━━━━━━━━━━━━━━━━━━━━┫',
    '┃ 📦 *Producto solicitado*',
    '┃',
    `┃  *${product.name}*`,
  ]

  if (product.category_name) lines.push(`┃  Categoría: ${product.category_name}`)
  if (product.material_name) lines.push(`┃  Material:  ${product.material_name}`)
  if (product.dimensions) lines.push(`┃  Medidas:   ${product.dimensions}`)

  lines.push('┃')
  lines.push('┣━━━━━━━━━━━━━━━━━━━━━━━━┫')
  lines.push('┃ 💰 *Precio referencia*')
  lines.push(`┃  *$${Number(product.price).toLocaleString()}*${product.price_unit ? ` /${product.price_unit}` : ''}`)
  lines.push('┗━━━━━━━━━━━━━━━━━━━━━━━━┛')
  lines.push('')
  lines.push('Quedo atento a su cotización formal.')
  lines.push('Gracias. 🙏')

  const msg = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
}

/** Cart — multi-product quote request sent by client */
export function buildCartWhatsAppUrl(
  items: CartItem[],
  total: number,
  profile: Profile | null,
  email?: string,
): string {
  const totalUnits = items.reduce((s, i) => s + i.quantity, 0)

  const lines: string[] = [
    'Hola Mayand, solicito cotización por los siguientes productos:',
    '',
    '┏━━━━━━━━━━━━━━━━━━━━━━━━┓',
    '┃  📋 *SOLICITUD DE COTIZACIÓN*',
    '┃  Mayand Gran Formato',
    '┣━━━━━━━━━━━━━━━━━━━━━━━━┫',
    `┃ Fecha: ${getDate()}`,
    '┣━━━━━━━━━━━━━━━━━━━━━━━━┫',
    '┃ 👤 *Datos del solicitante*',
    buildClientBlock(profile, email),
    '┣━━━━━━━━━━━━━━━━━━━━━━━━┫',
    '┃ 🛒 *Detalle del pedido*',
    '┃',
  ]

  // Item table
  lines.push('┃  #   Producto              Cant.   Subtotal')
  lines.push('┃  ─── ──────────────── ───── ─────────')

  items.forEach((item, i) => {
    const num = String(i + 1).padStart(2, '0')
    const subtotal = item.price * item.quantity
    lines.push(`┃  ${num}. ${item.name}`)
    lines.push(`┃      ${item.quantity} x $${item.price.toLocaleString()} = *$${subtotal.toLocaleString()}*`)
    if (i < items.length - 1) lines.push('┃')
  })

  lines.push('┃')
  lines.push('┣━━━━━━━━━━━━━━━━━━━━━━━━┫')
  lines.push('┃ 📊 *Resumen*')
  lines.push(`┃  Productos: ${items.length}`)
  lines.push(`┃  Unidades:  ${totalUnits}`)
  lines.push('┃')
  lines.push(`┃  💰 *Total estimado: $${total.toLocaleString()}*`)
  lines.push('┗━━━━━━━━━━━━━━━━━━━━━━━━┛')
  lines.push('')
  lines.push('Quedo atento a su cotización formal con precios finales.')
  lines.push('Gracias. 🙏')

  const msg = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
}
