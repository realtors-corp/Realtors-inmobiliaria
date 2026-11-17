REALTORS MODERN + Supabase
Esta versión conserva el diseño REALTORS MODERN y conecta el catálogo público con Supabase.
Archivos principales
`index.html`, `styles.css`: diseño REALTORS MODERN.
`assets/js/supabase.js`: cliente Supabase (URL y publishable key).
`assets/js/app.js`: carga catálogo y galerías desde Supabase.
`assets/ventas/cusco/`: fotografías originales de Cusco.
Antes de publicar
En Supabase SQL Editor, ejecutar una sola vez el contenido de `supabase-permisos-api.sql`.
Después probar el sitio desde GitHub Pages. No publicar nunca claves `service_role` o Secret.
Importante
Las fotos de Cusco se conservan en los assets del sitio y la tabla registra rutas relativas. La migración de esas fotos a Supabase Storage y el panel privado de administración son fases siguientes.
