# 🔍 Instrucciones de Debug para Problemas de Autenticación

## ✅ Cambios Realizados

### 1. UserProfile - Eliminado Auto-Save
- **❌ ANTES:** Los cambios se guardaban automáticamente al cambiar campos
- **✅ AHORA:** Los cambios SOLO se guardan al presionar "Guardar Cambios"

**Comportamiento actual:**
1. Usuario selecciona foto → Se sube a Cloudinary → Se muestra preview
2. Usuario cambia username → Solo se actualiza el input
3. Usuario cambia password → Solo se actualiza el input
4. **NADA se guarda en DB hasta presionar el botón "Guardar Cambios"**

### 2. Agregado Campo `token` al tipo Login
```typescript
export interface Login {
  _id?: string;
  photo: string;
  username: string;
  email: string;
  password: string;
  rol: string;
  token?: string; // ← NUEVO
  update?: Date | string;
}
```

### 3. Agregado Debugging en Console
- Login muestra el token recibido
- initializeAuth muestra si encuentra user/token en localStorage

## 🧪 Cómo Encontrar el Problema del Token

### Paso 1: Verifica qué devuelve el Backend al hacer Login

1. Abre DevTools (F12) → Console
2. Haz logout
3. Haz login nuevamente
4. Busca en la consola:
   ```
   🔐 Login Response: { ... }
   🎫 Token recibido: ...
   ```

**Casos posibles:**

#### ✅ CASO 1: Token está en response.token
```javascript
🔐 Login Response: {
  _id: "...",
  username: "...",
  email: "...",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  ← AQUÍ ESTÁ
  rol: "Usuario"
}
🎫 Token recibido: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**→ Perfecto, no hay que hacer nada**

#### ⚠️ CASO 2: Token NO está en la respuesta
```javascript
🔐 Login Response: {
  _id: "...",
  username: "...",
  email: "...",
  rol: "Usuario"
}
🎫 Token recibido: undefined
⚠️ No se recibió token en la respuesta de login
```
**→ El backend NO está enviando el token**

#### ⚠️ CASO 3: Token está en otro lugar
```javascript
🔐 Login Response: {
  user: {
    _id: "...",
    username: "...",
  },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  ← AQUÍ ESTÁ
  rol: "Usuario"
}
🎫 Token recibido: undefined
```
**→ El backend envía el token pero con otro nombre**

### Paso 2: Verifica qué hay en localStorage

Después de hacer login:
1. DevTools → Application → Local Storage → http://localhost:5173
2. Busca las keys `user` y `token`
3. Haz click en cada una para ver su contenido

**Casos posibles:**

#### ✅ CASO A: Ambos existen y están correctos
```
user: {"_id":"...","username":"...","token":"eyJhbGciOi...","rol":"Usuario"}
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**→ Perfecto, pasa al Paso 3**

#### ⚠️ CASO B: user existe pero token es null
```
user: {"_id":"...","username":"...","token":null,"rol":"Usuario"}
token: null
```
**→ El backend no está devolviendo el token**

#### ⚠️ CASO C: Solo existe user, no hay token separado
```
user: {"_id":"...","username":"...","rol":"Usuario"}
token: (no existe)
```
**→ El setUser no está guardando el token**

### Paso 3: Verifica qué pasa al Refrescar

1. Estando logueado, presiona F5 (refrescar página)
2. Busca en la consola:
   ```
   🔄 Inicializando autenticación...
   📦 User en localStorage: Sí / No
   🎫 Token en localStorage: Sí / No
   ✅ Sesión restaurada para: username
   ```

**Casos posibles:**

#### ✅ CASO X: Se restaura correctamente
```
🔄 Inicializando autenticación...
📦 User en localStorage: Sí
🎫 Token en localStorage: Sí
✅ Sesión restaurada para: tu_username
```
**→ NO redirige al login, sigues en la página actual**

#### ❌ CASO Y: No encuentra datos
```
🔄 Inicializando autenticación...
📦 User en localStorage: No
🎫 Token en localStorage: No
⚠️ No hay sesión guardada
```
**→ Te redirige al login**

#### ❌ CASO Z: Encuentra datos pero hay error 401
```
🔄 Inicializando autenticación...
📦 User en localStorage: Sí
🎫 Token en localStorage: Sí
✅ Sesión restaurada para: tu_username
(Luego aparece error 401 y te redirige al login)
```
**→ El token existe pero el backend lo rechaza (expirado/inválido)**

## 🔧 Soluciones Según el Caso

### Si el backend NO envía el token (Casos 2, B, o C)

El problema está en el **backend**. Necesitas modificar el endpoint de login para que devuelva el token.

**Ejemplo en NestJS:**
```typescript
// login.controller.ts
@Post()
async login(@Body() credentials: LoginDto) {
  const user = await this.loginService.validateUser(credentials);

  // Generar JWT token
  const token = this.jwtService.sign({
    sub: user._id,
    username: user.username
  });

  // IMPORTANTE: Devolver el token junto con los datos del usuario
  return {
    ...user,
    token  // ← Asegúrate de incluir esto
  };
}
```

### Si el backend envía el token con otro nombre (Caso 3)

Modifica `useAuth.ts` para normalizar:

```typescript
const login = async (credentials: LoginRequest) => {
  const response = await authApi.login(credentials);

  // Normalizar si el token viene con otro nombre
  const normalizedResponse = {
    ...response,
    token: response.token || response.accessToken || response.jwt // ← Agregar esto
  };

  dispatch(setUser(normalizedResponse));
};
```

### Si hay error 401 al refrescar (Caso Z)

El token está expirando muy rápido o el backend no lo acepta. Verifica:

1. **Tiempo de expiración del token:**
```typescript
// Backend
this.jwtService.sign(payload, { expiresIn: '7d' }) // ← Aumenta esto
```

2. **Verificación del token:**
```typescript
// Backend - Asegúrate de que el middleware JWT esté correctamente configurado
```

## 📋 Checklist de Diagnóstico

Completa este checklist y reporta los resultados:

- [ ] Al hacer login, ¿aparece el token en la consola?
  - Sí → Token: `___________`
  - No → Aparece: `___________`

- [ ] ¿Qué hay en localStorage después del login?
  - `user`: `___________`
  - `token`: `___________`

- [ ] Al refrescar la página (F5), ¿qué pasa?
  - [ ] Se mantiene la sesión (NO redirige)
  - [ ] Redirige al login inmediatamente
  - [ ] Redirige después de mostrar la página por 1 segundo

- [ ] ¿Qué mensajes aparecen en la consola al refrescar?
  ```
  ___________
  ```

## 🎯 Resultado Esperado

**Flujo correcto:**

1. **Login:**
   - Backend devuelve: `{ _id, username, email, rol, token: "eyJ..." }`
   - localStorage guarda: `user` + `token`
   - No aparecen errores

2. **Navegación:**
   - Usuario puede navegar libremente
   - Token se envía en todas las peticiones (Authorization header)

3. **Refrescar página:**
   - `initializeAuth` lee `user` y `token` de localStorage
   - Restaura sesión sin hacer petición al backend
   - NO redirige al login

4. **Actualizar perfil:**
   - Usuario cambia foto/username
   - Presiona "Guardar Cambios"
   - Se guarda en DB
   - Redux se actualiza inmediatamente
   - UI se actualiza sin refrescar página

## 📞 Próximos Pasos

1. Ejecuta los pasos de diagnóstico
2. Anota los resultados del checklist
3. Comparte los logs de la consola
4. Con esa información podremos identificar exactamente dónde está el problema
