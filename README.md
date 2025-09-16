# Printología - Cotización de Impresión Gran Formato

Una aplicación web moderna y elegante para cotizar impresiones de gran formato desarrollada con Next.js 14+.

## ✨ Características Destacadas

- 🎨 **Modo Dark/Light** - Toggle para cambiar entre temas
- 📱 **Layout Fijo sin Scroll** - Diseño optimizado para 100vh/100vw
- 🖥️ **Grid Layout Responsivo** - 3 columnas en desktop, tabs en mobile
- 🎯 **Sidebar Izquierdo** - Calculadora y subida de archivos
- 👁️ **Panel Central** - Preview del PDF con visor integrado
- 💰 **Panel Derecho** - Cotización y formulario de contacto
- ✨ **Animaciones Suaves** - Micro-interacciones y transiciones
- 🔄 **Cálculos en Tiempo Real** - Actualización automática de precios
- 📄 **Preview de PDF** - Visor integrado sin librerías problemáticas

## 🚀 Características

- **SPA sin scroll** - Toda la funcionalidad en un viewport
- **Responsive Design** - 3 columnas en desktop, tabs en mobile
- **Cálculos en tiempo real** - Precios dinámicos con descuentos por volumen
- **Preview de PDF** - Visualización integrada con zoom y navegación
- **Validación completa** - Formularios con Zod y React Hook Form
- **Envío de correos** - Integración con Resend (EmailJS alternativo)
- **UI moderna** - Componentes shadcn/ui con Tailwind CSS

## 🛠️ Stack Tecnológico

- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS 4.0** - Estilos utilitarios
- **shadcn/ui** - Componentes UI
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **PDF.js** - Visualización de PDFs
- **Resend** - Envío de correos moderno

## 📋 Requisitos de Negocio

- **Máquinas**: Ancho máximo 160cm, largo hasta 360cm
- **Precios**:
  - Vinil: $180 MXN/m² (normal), $140 MXN/m² (>10m²)
  - Lona: $80 MXN/m² (normal), $65 MXN/m² (>10m²)
- **IVA**: 16%
- **Archivos**: Solo PDFs, máximo 50MB

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
│   ├── FileUpload.tsx
│   ├── PDFPreview.tsx
│   ├── QuoteDisplay.tsx
│   ├── ContactForm.tsx
│   └── ErrorBoundary.tsx
├── lib/
│   ├── utils.ts
│   ├── calculations.ts
│   ├── validations.ts
│   └── email-service.ts
└── types/
    └── index.ts
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

3. **Configurar Resend**:
   - Crear cuenta en [resend.com](https://resend.com)
   - Verificar tu dominio de email
   - Obtener API Key desde el dashboard
   - Configurar variables de entorno en `.env.local`:
   ```env
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Ejecutar el proyecto**:
   ```bash
   npm run dev
   ```

## 🎨 Diseño y Layout Optimizado

### Desktop (1200px+) - Layout Fijo sin Scroll:
```
┌─────────────────────────────────────────────────┐
│  HEADER: Printología + Theme Toggle            │
├─────────────┬─────────────────┬─────────────────┤
│             │                 │                 │
│  SIDEBAR    │   PDF PREVIEW   │   QUOTE &       │
│  IZQUIERDO  │   PANEL         │   CONTACT       │
│             │                 │                 │
│  • Inputs   │  • PDF Viewer   │  • Cotización   │
│  • Material │  • File Info    │  • Formulario   │
│  • Upload   │  • Actions      │  • Envío        │
│             │                 │                 │
└─────────────┴─────────────────┴─────────────────┘
```

### Mobile/Tablet - Sistema de Tabs:
- 📱 **Tab 1**: Calculadora + Upload
- 👁️ **Tab 2**: PDF Preview
- 💰 **Tab 3**: Cotización + Contacto

### 🎯 Características del Diseño:
- **100vh/100vw** - Layout completamente fijo
- **Glassmorphism** - Efectos de vidrio translúcido
- **Animaciones** - Micro-interacciones suaves
- **Modo Dark** - Tema oscuro completo
- **Responsive** - Adaptable a todos los dispositivos

## 📧 Funcionalidades del Formulario

- Validación completa con Zod
- Estados de loading, success, error
- Adjunto automático del PDF al correo
- Reseteo automático después del envío exitoso

## 🎯 Funcionalidades Implementadas

### ✅ Completadas:
- [x] **Modo Dark/Light** - Toggle completo con persistencia
- [x] **Layout Fijo** - 100vh/100vw sin scroll
- [x] **Grid Layout Optimizado** - 3 columnas fijas
- [x] **Sidebar Izquierdo** - Calculadora + Upload
- [x] **Panel Central** - PDF Preview con visor integrado
- [x] **Panel Derecho** - Cotización + Formulario
- [x] **Glassmorphism** - Efectos de vidrio modernos
- [x] **Animaciones** - Micro-interacciones suaves
- [x] **PDF Preview** - Visor nativo sin problemas
- [x] **Responsive Design** - Desktop + Mobile optimizado

### 🔄 Próximos Pasos (Opcionales):
- [x] Configurar Resend para envío de correos
- [ ] Añadir persistencia de datos localStorage
- [ ] Implementar PWA features
- [ ] Añadir más tipos de material
- [ ] Desplegar en Vercel

## 📄 Licencia

Este proyecto está desarrollado para Printología.
