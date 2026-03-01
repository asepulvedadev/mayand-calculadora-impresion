'use client'

import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { useAuth } from '@/lib/hooks/useAuth'
import { getProductImageUrl } from '@/lib/storage'
import { buildCartWhatsAppUrl } from '@/lib/whatsapp'

export function CartModal() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, itemCount, total } = useCart()
  const { user, profile } = useAuth()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[90] h-full w-[90%] max-w-md transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0530] to-[#080422] border-l border-white/[0.06]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#458FFF]" />
              <h2 className="text-white font-bold text-sm sm:text-base">
                Carrito
                {itemCount > 0 && (
                  <span className="ml-1.5 text-white/30 font-medium text-xs">({itemCount})</span>
                )}
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <ShoppingBag size={28} className="text-white/15" />
              </div>
              <p className="text-white/40 text-sm font-medium mb-1">Tu carrito está vacío</p>
              <p className="text-white/20 text-xs">Agrega productos desde el catálogo</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-white/[0.04]">
                    <Image
                      src={getProductImageUrl(item.image_url)}
                      alt={item.name}
                      width={72}
                      height={72}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {item.category_name && (
                          <span
                            className="text-[8px] font-bold uppercase tracking-wider"
                            style={{ color: item.category_color || '#458FFF' }}
                          >
                            {item.category_name}
                          </span>
                        )}
                        <h3 className="text-white font-semibold text-xs truncate leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-white/20 hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.12] flex items-center justify-center transition-all"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-white text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.12] flex items-center justify-center transition-all"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Item subtotal */}
                      <span className="text-[#FFD700] font-bold text-xs">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-white/[0.06] px-4 sm:px-5 py-4 space-y-3">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Total estimado</span>
                <span className="text-[#FFD700] text-lg font-black">${total.toLocaleString()}</span>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={buildCartWhatsAppUrl(items, total, profile, user?.email)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#22c55e] active:scale-[0.98] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Cotizar por WhatsApp
              </a>

              {/* Clear */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-white/25 text-xs font-medium hover:text-white/50 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/** Reusable cart icon button with badge */
export function CartButton({ className = '' }: { className?: string }) {
  const { itemCount, setIsOpen } = useCart()

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`relative p-2.5 rounded-xl bg-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all ${className}`}
    >
      <ShoppingBag size={16} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-[#458FFF] text-white text-[9px] font-bold leading-none">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
