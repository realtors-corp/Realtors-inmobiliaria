-- REALTORS: permisos SQL para exponer las tablas necesarias mediante Data API.
-- Ejecutar una sola vez en Supabase SQL Editor.

GRANT SELECT ON TABLE public.propiedades TO anon, authenticated;
GRANT SELECT ON TABLE public.imagenes_propiedades TO anon, authenticated;

-- Los formularios públicos podrán insertar consultas nuevas.
GRANT INSERT ON TABLE public.leads TO anon, authenticated;

-- Los usuarios autenticados necesitan leer el registro administrador
-- para que las políticas RLS puedan validar su propio acceso.
GRANT SELECT ON TABLE public.administradores TO authenticated;

-- El panel privado necesitará estos permisos cuando se implemente.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.propiedades TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.imagenes_propiedades TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.leads TO authenticated;
