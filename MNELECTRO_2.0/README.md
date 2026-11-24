# MNELECTRO 2.0 — Tech Black (prototipo de demostración)

Evolución del prototipo MNELECTRO Tech Black. HTML, CSS y JavaScript puros, sin dependencias ni compilación.
**No reemplaza la tienda original:** el prototipo anterior se conserva intacto en `original-tech-black/`.

## Cómo abrir
1. Descomprime el ZIP.
2. Abre `index.html` en el navegador (o usa Live Server en VS Code).
3. Necesita internet para las fuentes (Google Fonts) y las fotos de ejemplo (Unsplash). Sin conexión, cada imagen muestra un respaldo con el logotipo MN.

## Estructura
- `index.html`: estructura, SEO básico (title, description, Open Graph, JSON-LD) y diálogos.
- `css/styles.css`: identidad Tech Black, mobile-first, animaciones y `prefers-reduced-motion`.
- `js/data.js`: **catálogo de demostración** (único lugar para editar productos, precios y categorías).
- `js/app.js`: filtros, carrito, favoritos, diálogos, scroll y formularios.
- `original-tech-black/`: proyecto original sin cambios.

## Funcionalidades
- Hero con entrada escalonada, indicador de scroll, parallax sutil (solo escritorio) y barra de progreso de lectura.
- Secciones: categorías, catálogo, más vendidos (demo), marca, ofertas (espacio pendiente), colecciones y novedades (demo), beneficios, reseñas (placeholders), newsletter y footer.
- Buscador sin distinguir tildes, filtros por categoría y precio, ordenamiento; todos combinables, con estado vacío y botón "Limpiar filtros".
- Carrito lateral: agregar, sumar/restar, quitar, vaciar, subtotal y estado vacío. Persistente en localStorage.
- Favoritos persistentes (localStorage) con contador y filtro propio.
- Vista rápida y carrito como diálogos accesibles: foco atrapado, Escape, clic exterior y retorno del foco.
- Menú móvil con `aria-expanded`, notificaciones visuales, validación del newsletter, botón flotante para volver arriba.
- Respeta `prefers-reduced-motion`; imágenes con `srcset`, carga diferida y respaldo SVG.
- Botón "Borrar datos locales de la demo" en el footer.

## Qué es demostración
- Los 8 productos, sus precios, categorías y etiquetas ("Nuevo", "Destacado"). Los 4 primeros provienen del prototipo original; los otros 4 son genéricos.
- "Más vendidos" y "Novedades" son selecciones de ejemplo, rotuladas como Demo.
- Ofertas: **no hay descuentos cargados**; son espacios vacíos.
- Reseñas: placeholders, sin testimonios.
- Fotos: imágenes de ejemplo de Unsplash (algunas se repiten entre productos).
- Checkout, cuenta y newsletter: simulados. No hay pagos ni se recolectan ni envían datos personales.

## Qué debe confirmar el propietario
Catálogo, precios, stock, fotos propias y permisos de uso de marca; envíos, medios de pago, garantías y cambios; datos de contacto y redes; descuentos y vigencias; textos legales.

## Integraciones pendientes para una tienda real
1. Plataforma de comercio (Tiendanube, WooCommerce, Shopify u otra) y migración del diseño a su tema.
2. Catálogo, stock y precios desde API en lugar de `js/data.js`.
3. Checkout y pasarela de pago reales; cálculo de envíos.
4. Cuentas de cliente.
5. Newsletter con proveedor (Mailchimp, Brevo, etc.) y consentimiento.
6. Reseñas verificadas reales.
7. Imágenes propias optimizadas (WebP/AVIF) alojadas localmente; fuentes autoalojadas.
8. Analítica, políticas de privacidad/cookies, `sitemap.xml`, `robots.txt` y datos estructurados de producto.
9. Pruebas con dispositivos reales y auditoría Lighthouse con el contenido final.
