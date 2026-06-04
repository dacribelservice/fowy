# Diagnóstico y Solución: Error de Tipado en Vercel (Singleton de Supabase)

## Explicación del Problema
El error de compilación en Vercel (`Type error: Parameter '_event' implicitly has an 'any' type`) que provocó la "X roja" en GitHub no fue causado por renombrar la variable a `_event`, ya que en TypeScript el nombre de la variable no destruye su inferencia de tipo. 

La causa raíz se originó el 30 de Mayo de 2026 durante la Fase 7 del refactory (implementación del Singleton de Supabase para corregir bloqueos de concurrencia). En el archivo `client.ts`, el cliente maestro global se definió con el tipo laxo `any` (`let supabaseClientInstance: any = null;`). 

Al estar la raíz tipada como `any`, toda la cadena de funciones hacia adelante (incluyendo llamadas como `supabase.auth.onAuthStateChange` en `layout.tsx`, `useAuth.ts` y `useFavorites.ts`) perdió su seguridad de tipado. Bajo las estrictas reglas del compilador de Vercel (`noImplicitAny`), esto obligó a abortar la compilación.

## Solución Definitiva (Opción 1: Tipado de Raíz)
En lugar de esparcir parches `any` por múltiples archivos, la solución más limpia y profesional es tipar correctamente la instancia del Singleton en `client.ts`. Esto devuelve automáticamente la validación y seguridad estricta de TypeScript a toda la aplicación, resolviendo el error sin tocar los componentes que consumen el hook.

### 📋 Checklist de Solución
- [ ] **1. Modificar `src/utils/supabase/client.ts`:**
  Ir a la línea 4 y cambiar el tipo de la instancia, reemplazando la declaración actual por la inferencia dinámica de `createBrowserClient`.
  
  **Reemplazar esta línea:**
  ```typescript
  let supabaseClientInstance: any = null;
  ```
  **Por esta línea:**
  ```typescript
  let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null = null;
  ```

- [ ] **2. Guardar y Verificar:** Al realizar este único cambio en el archivo origen, el error desaparecerá en Vercel y el siguiente commit mostrará el check verde en GitHub.
