# Registro de Errores en Vercel / GitHub

Este documento rastrea los errores críticos encontrados durante el proceso de despliegue en Vercel y su resolución.

## Errores de Construcción (Build Errors)

### 1. Error de Tipado Implícito 'any'
- **Archivo:** `src/components/partners/business/menu/ProductFormModal.tsx`
- **Descripción:** Las props del componente no tenían un tipo definido o utilizaban `any` implícito, lo que causaba que el compilador de TypeScript de Vercel fallara.
- **Resolución:** Se definió la interfaz `ProductFormModalProps` y se aplicó al componente. Se deben evitar los bloques `catch (err: any)` y cambiarlos por `catch (err: unknown)`.

### 2. Atributos Duplicados en JSX
- **Archivo:** `src/app/(explorer)/[slug]/page.tsx`
- **Descripción:** El componente `ProductGrid` tenía el atributo `categories` declarado dos veces.
- **Resolución:** Se eliminó la declaración redundante.

### 3. Módulos No Encontrados (Module Not Found)
- **Causa:** Desincronización tras restauraciones de Git (Commits). Los archivos se movieron de `src/app/(partners)/business/menu/components/` a `src/components/partners/business/menu/`.
- **Resolución:** Actualizar las rutas de importación en `page.tsx` para que coincidan con la ubicación real de los componentes.

## Errores de Renderizado y Layout

### 1. Mapa de Negocio Invisible (Desktop)
- **Archivos:** `PageTransition.tsx` y `MobileFrame.tsx`
- **Descripción:** El uso de `min-h-full` y `scrollbar-hide` impedía que el mapa ocupara el espacio vertical necesario en pantallas de escritorio, resultando en un mapa de 0px de altura.
- **Resolución:** Cambiar clases CSS a `h-full w-full` y asegurar que el contenedor principal permita la expansión flexible.

## Estado Actual
- **Commit de Referencia:** `7776db0` (Restaurado para estabilidad).
- **Pendiente:** Eliminar usos restantes de `any` en bloques `catch` para cumplir con las reglas estrictas de Vercel.
