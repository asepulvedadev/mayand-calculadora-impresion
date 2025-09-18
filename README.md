# Mayand - Cotización de Impresión Gran Formato

Una aplicación web moderna y elegante para cotizar impresiones de gran formato desarrollada con Next.js 14+. Aplicación PWA optimizada para dispositivos móviles y desktop.

## ✨ Características Destacadas

- 📱 **Aplicación PWA** - Instalable en dispositivos móviles y desktop
- 🎨 **Tema Dark Optimizado** - Diseño moderno con colores personalizados
- 📱 **Layout Fijo sin Scroll** - Diseño optimizado para 100vh/100vw
- 🖥️ **Grid Layout Responsivo** - 2 columnas en desktop, diseño móvil optimizado
- 🎯 **Calculadora Inteligente** - Cálculos automáticos con validaciones
- 💰 **Cotización en Tiempo Real** - Precios dinámicos por material
- 📱 **WhatsApp Integration** - Compartir cotizaciones directamente
- ✨ **Animaciones Suaves** - Micro-interacciones y transiciones
- 🔄 **Cálculos en Tiempo Real** - Actualización automática de precios
- 📏 **Unidades Dinámicas** - Metros lineales para vinil, metros cuadrados para lona

## 🚀 Características

- **Aplicación PWA** - Instalación en dispositivos móviles y desktop
- **SPA sin scroll** - Toda la funcionalidad en un viewport
- **Responsive Design** - 2 columnas en desktop, diseño móvil optimizado
- **Cálculos en tiempo real** - Precios dinámicos por material y dimensiones
- **Materiales múltiples** - Vinil, Vinil Transparente y Lona con precios diferenciados
- **Unidades inteligentes** - Metros lineales para vinil, metros cuadrados para lona
- **WhatsApp sharing** - Compartir cotizaciones directamente por WhatsApp
- **Validación completa** - Validaciones de dimensiones por material
- **UI moderna** - Componentes shadcn/ui con Tailwind CSS y tema personalizado

## 🛠️ Stack Tecnológico

- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS 4.0** - Estilos utilitarios con tema personalizado
- **shadcn/ui** - Componentes UI modernos
- **PWA** - Service Worker y Web App Manifest
- **WhatsApp API** - Integración para compartir cotizaciones
- **React State Management** - useState y useEffect para estado local

## 📋 Requisitos de Negocio

- **Dimensiones Máximas**:
  - Vinil: Ancho máximo 150cm, largo hasta 360cm
  - Vinil Transparente: Ancho máximo 150cm, largo hasta 360cm
  - Lona: Ancho máximo 180cm, largo hasta 360cm
- **Precios**:
  - Vinil: $180 MXN/metro lineal (altura)
  - Vinil Transparente: $180 MXN/metro lineal (altura)
  - Lona: $80 MXN/m² (normal), $65 MXN/m² (>10m²)
- **IVA**: 16%
- **Unidades**: Metros lineales para vinil, metros cuadrados para lona

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── DimensionCalculator.tsx
│   ├── QuoteDisplay.tsx
│   ├── PWA.tsx
│   └── ErrorBoundary.tsx
├── lib/
│   ├── utils.ts
│   ├── calculations.ts
│   └── validations.ts
├── types/
│   └── index.ts
└── public/
    ├── manifest.json
    ├── sw.js
    └── icons/ (PWA icons)
```

## 🚀 Instalación y Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar shadcn/ui**:
   ```bash
   npx shadcn@latest init --yes
   npx shadcn@latest add input label switch card button tabs textarea form alert separator badge
   ```


4. **Ejecutar el proyecto**:
   ```bash
   npm run dev
   ```

## 🎨 Diseño y Layout Optimizado

### Desktop (1200px+) - Layout Optimizado:
```
┌─────────────────────────────────────────────────┐
│  HEADER: Mayand + WhatsApp Share               │
├─────────────────────────┬───────────────────────┤
│                         │                       │
│  CALCULADORA            │   COTIZACIÓN          │
│  INTELIGENTE            │   EN TIEMPO REAL      │
│                         │                       │
│  • Dimensiones          │  • Precio Unitario    │
│  • Material             │  • Subtotal           │
│  • Validaciones         │  • IVA                │
│  • Unidades             │  • Total              │
│                         │                       │
└─────────────────────────┴───────────────────────┘
```

### Mobile - Diseño Optimizado:
- 📱 **Vista Unificada**: Calculadora y cotización en una sola vista
- 🎯 **Navegación Intuitiva**: Diseño mobile-first responsive
- 📱 **PWA Ready**: Instalable en dispositivos móviles

### 🎯 Características del Diseño:
- **100vh/100vw** - Layout completamente fijo
- **Glassmorphism** - Efectos de vidrio translúcido
- **Animaciones** - Micro-interacciones suaves
- **Tema Personalizado** - Color #110363 como base
- **PWA** - Instalable en dispositivos móviles
- **Responsive** - Diseño mobile-first optimizado
- **WhatsApp Integration** - Compartir cotizaciones fácilmente

## 📱 Funcionalidades PWA y WhatsApp

- **Instalación PWA** - Aplicación instalable en dispositivos móviles
- **Offline Support** - Service Worker para funcionamiento offline
- **WhatsApp Sharing** - Compartir cotizaciones directamente por WhatsApp
- **Responsive Design** - Optimizado para móviles y desktop
- **Fast Loading** - Carga rápida y optimizada

## 🎯 Funcionalidades Implementadas

### ✅ Características Implementadas:
- [x] **Aplicación PWA** - Instalable con Service Worker y Manifest
- [x] **Tema Dark Personalizado** - Color #110363 como tema base
- [x] **Layout Fijo** - 100vh/100vw sin scroll
- [x] **Grid Layout Optimizado** - 2 columnas en desktop
- [x] **Calculadora Inteligente** - Validaciones por material
- [x] **Cotización en Tiempo Real** - Cálculos automáticos
- [x] **WhatsApp Sharing** - Compartir cotizaciones por WhatsApp
- [x] **Materiales Múltiples** - Vinil, Vinil Transparente y Lona
- [x] **Unidades Dinámicas** - Metros lineales/cuadrados según material
- [x] **Glassmorphism** - Efectos de vidrio modernos
- [x] **Animaciones** - Micro-interacciones suaves
- [x] **Responsive Design** - Mobile-first optimizado

### 🔄 Mejoras Futuras (Opcionales):
- [ ] Añadir persistencia de datos con localStorage
- [ ] Implementar notificaciones push
- [ ] Añadir más tipos de material
- [ ] Crear sistema de descuentos por volumen
- [ ] Implementar modo offline avanzado
- [ ] Añadir historial de cotizaciones
- [ ] Desplegar en Vercel/Netlify

## 📄 Licencia

Este proyecto está desarrollado para Mayand.
