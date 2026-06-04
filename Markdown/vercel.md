# Problema con el Despliegue en Vercel (Error de tipado implícito)

## Explicación del Problema
El error en Vercel es un daño colateral que ocurrió durante la eliminación del "componente fantasma" (`BusinessNotificationListener.tsx`), que fue la solución exitosa para el problema de la pantalla blanca en iPhone. 

Al remover ese componente, el archivo `layout.tsx` tuvo que limpiarse. Durante esta limpieza, se renombró la variable de inicio de sesión `event` a `_event` para silenciar una advertencia menor del linter (variable no usada). Sin embargo, al hacer este cambio, el motor estricto de Vercel revisó la línea y se dio cuenta de que la variable quedó con un tipo "comodín" de manera implícita. Bajo sus reglas estrictas de TypeScript, Vercel no permite compilar la aplicación si hay parámetros con tipo `any` implícito en funciones críticas de autenticación.

## Solución 
- [x] **Tipado Explícito en `layout.tsx`:** Ir a la línea 61 del archivo `src/app/(explorer)/layout.tsx` y cambiar la estructura de la función de `(_event, session)` a `(_event: any, session: any)`.
- [x] **Revisión Adicional (si aplica):** Si Vercel reporta el mismo error en `src/hooks/useAuth.ts`, aplicar exactamente la misma solución añadiendo `: any` a los parámetros.

> **Nivel de Riesgo: 1/10** (Riesgo nulo. Solo se le coloca la etiqueta exigida por Vercel para permitir la compilación; no altera la lógica, ni el arreglo del iPhone).
