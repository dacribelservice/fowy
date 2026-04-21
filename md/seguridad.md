# 🔐 PROTOCOLO BÚNKER: SEGURIDAD FOWY

> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

> "La seguridad no es una capa, es el cimiento."

## 1. ARQUITECTURA DE IDENTIDAD (AUTH)

### Decisión: Supabase Auth + Custom Claims (JWT)
**Por qué es la mejor decisión:**
Al usar **Custom Claims** (metadatos dentro del token JWT), el servidor no necesita consultar la base de datos en cada petición para saber si un usuario es "Admin" o "Vendedor". La información viaja en el token de forma encriptada y verificable.

**Implementación:**
- **Admin**: Acceso total.
- **Profesional**: Acceso a leads y herramientas técnicas.
- **Vendedor**: Acceso a gestión de referidos y captación.
- **Negocio**: Acceso exclusivo a su local y su Menú Digital.
- **Usuario**: Acceso a su perfil y pedidos.

---

## 2. EL ESCUDO: RLS (ROW LEVEL SECURITY)

**Decisión: Política de "Denegación por Defecto"**
**Por qué es la mejor decisión:**
A diferencia de otros sistemas donde olvidas una comprobación `if` y expones datos, en Postgres RLS el dato es invisible a menos que exista una política explícita que diga "este usuario puede ver esto".

**Reglas de Oro:**
1.  `profiles`: Solo el dueño puede ver su perfil. Solo el Admin puede ver todos.
2.  `negocios`: Solo el dueño del negocio (o el administrador) puede editar. El público solo puede ver el Menú Digital.
3.  `configuracion_sistema`: Solo accesible via `service_role` (Backend).

---

## 3. PROTECCIÓN DE RUTAS (MIDDLEWARE)

**Decisión: Interceptación en el Edge**
**Por qué es la mejor decisión:**
Al validar el rol en el `middleware.ts` de Next.js, bloqueamos el acceso antes de que la página comience a renderizarse. Ahorramos recursos y evitamos "flashes" de contenido prohibido.

```typescript
// Ejemplo de lógica
if (path.startsWith('/admin') && userRole !== 'ADMIN') {
  return redirect('/unauthorized');
}
```

---

## 4. AUDITORÍA Y TRAZABILIDAD

**Decisión: Registro de Operaciones Críticas**
Cada cambio en el estado de un negocio o una transacción de venta dejará una huella digital en una tabla de `logs_seguridad` que es de **solo escritura** (insert only) para evitar que un atacante borre sus rastros.

---

## 5. INTEGRIDAD FINANCIERA (MONEDA DIGITAL)

**Decisión: Arquitectura de Historial Inmutable (Ledger)**
**Por qué es la mejor decisión:**
Para evitar el "hackeo de saldo", el sistema no guarda el dinero como un número editable. El saldo es el resultado de la suma de todas las transacciones verificadas.

1.  **Bloqueo de Escritura Directa**: Ningún usuario (ni Admin) puede modificar su saldo directamente vía SQL. Solo se permiten inserciones vía Funciones de Servidor Protegidas (RPC).
2.  **Validación Server-Side**: Cada movimiento de dinero requiere una validación de "Balance Suficiente" en el motor de la base de datos (Postgres) antes de confirmarse.
3.  **Sellado de Transacciones**: Cada registro de "Moneda FOWY" se guarda con un estado `verified`. Si el sistema detecta un cambio manual en la tabla sin pasar por el proceso oficial, invalida la transacción.

---

## 6. SISTEMA "KILL SWITCH" (DEFENSA ACTIVA)

**Decisión: Monitoreo de Patrones de Ataque**
1.  **Rate Limiting**: Bloqueo automático de IPs que intenten más de X peticiones por segundo.
2.  **Congelación de Cuentas**: Si una billetera digital genera transacciones sospechosas en tiempo récord, el sistema congela la cuenta automáticamente para revisión manual del SuperAdmin.
3.  **Auditoría Forense**: Todos los accesos fallidos y cambios de rol se graban en un log persistente e inmutable.

---
**"FOWY: Seguridad nivel bancario en cada línea de código."**

