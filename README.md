# ANDEXOR — Agencia de Inteligencia Artificial

Sitio web oficial de **ANDEXOR**, agencia de IA ubicada en Ilo, Perú. Especializada en desarrollo frontend, backend y auditorías digitales.

## Estructura

```
andexor/
├── index.html          # Página principal (SPA)
├── andexor.jpg         # Logo
├── assets/
│   └── favicon.svg
├── css/
│   ├── reset.css       # Reset base
│   ├── layout.css      # Variables, grid, tipografía
│   ├── components.css  # Componentes UI
│   └── animations.css  # Keyframes y scroll reveal
└── js/
    ├── scene.js        # Fondo 3D con Three.js
    ├── interactions.js # SPA, navbar, animaciones
    └── forms.js        # Validación del formulario
```

## Características

- Diseño SPA con 4 páginas (Home, Frontend, Backend, Auditorías)
- Fondo 3D interactivo con Three.js (con fallback si el CDN falla)
- Totalmente responsive: desktop, tablet y móvil
- Animaciones scroll reveal con IntersectionObserver
- Formulario de contacto con validación en tiempo real
- Compatible con Chrome, Edge y Firefox
- Funciona abriendo `index.html` directamente con `file://`

## Uso

Abre `index.html` directamente en el navegador o despliega en cualquier hosting estático (GitHub Pages, Netlify, Vercel).

---

&copy; 2026 ANDEXOR. Ilo, Moquegua — Perú.
