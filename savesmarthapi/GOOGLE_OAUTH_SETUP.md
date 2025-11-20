# Guía de Configuración de Google OAuth 2.0

Esta guía te ayudará a obtener las credenciales necesarias para implementar el login con Google en SaveSmart.

## Prerequisitos

- Una cuenta de Google
- Acceso a [Google Cloud Console](https://console.cloud.google.com/)

## Pasos para Configurar Google OAuth

### 1. Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. En la barra superior, haz clic en el selector de proyectos
3. Haz clic en "Nuevo Proyecto" (New Project)
4. Nombra tu proyecto (ej: "SaveSmart")
5. Haz clic en "Crear"

### 2. Habilitar la API de Google+

1. En el menú lateral, ve a **APIs y Servicios** > **Biblioteca**
2. Busca "Google+ API" o "Google OAuth2 API"
3. Haz clic en la API y luego en "Habilitar" (Enable)

### 3. Configurar la Pantalla de Consentimiento

1. En el menú lateral, ve a **APIs y Servicios** > **Pantalla de consentimiento de OAuth**
2. Selecciona **Externo** (External) como tipo de usuario
3. Haz clic en "Crear"
4. Completa el formulario:
   - **Nombre de la aplicación**: SaveSmart
   - **Correo electrónico de asistencia**: tu correo
   - **Logo de la aplicación**: (opcional)
   - **Dominio de la aplicación**: http://localhost:3000 (para desarrollo)
   - **Correo electrónico del desarrollador**: tu correo
5. Haz clic en "Guardar y continuar"
6. En **Ámbitos** (Scopes), no es necesario agregar ninguno adicional
7. Haz clic en "Guardar y continuar"
8. En **Usuarios de prueba**, agrega tu correo electrónico
9. Haz clic en "Guardar y continuar"

### 4. Crear Credenciales OAuth 2.0

1. En el menú lateral, ve a **APIs y Servicios** > **Credenciales**
2. Haz clic en **+ Crear Credenciales** > **ID de cliente de OAuth**
3. Selecciona **Aplicación web** como tipo de aplicación
4. Configura los siguientes campos:

   **Nombre**: SaveSmart Web Client

   **Orígenes de JavaScript autorizados**:
   ```
   http://localhost:3000
   http://localhost:5173
   ```

   **URIs de redireccionamiento autorizados**:
   ```
   http://localhost:3000/savesmarth/api/v1/login/google/callback
   ```

5. Haz clic en "Crear"
6. Se mostrará un modal con tus credenciales:
   - **ID de cliente** (Client ID)
   - **Secreto del cliente** (Client Secret)
7. **¡IMPORTANTE!** Copia estas credenciales de forma segura

### 5. Configurar Variables de Entorno

1. Abre tu archivo `.env` en el proyecto backend
2. Reemplaza los valores de las siguientes variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:3000/savesmarth/api/v1/login/google/callback
```

3. Guarda el archivo

### 6. Verificar Configuración

Asegúrate de que también tienes configuradas las siguientes variables en tu `.env`:

```env
# Frontend URL (debe coincidir con el origen autorizado)
FRONTEND_URL=http://localhost:5173

# JWT Secret (para generar tokens)
JWT_SECRET=savesmarth-secret-key-change-in-production-2024

# Database
MONGODB_URI=mongodb://localhost:27017/savesmarth
```

## Probar la Configuración

1. Inicia tu backend:
   ```bash
   npm run start:dev
   ```

2. Inicia tu frontend:
   ```bash
   npm run dev
   ```

3. Ve a http://localhost:5173/login
4. Haz clic en "Continuar con Google"
5. Deberías ser redirigido a la página de login de Google
6. Selecciona tu cuenta de Google
7. Acepta los permisos
8. Deberías ser redirigido de vuelta a tu aplicación y logueado automáticamente

## Solución de Problemas

### Error: "redirect_uri_mismatch"
- **Causa**: La URL de callback no coincide con las configuradas en Google Cloud Console
- **Solución**: Verifica que `GOOGLE_CALLBACK_URL` en `.env` coincida exactamente con la URI configurada en Google Cloud Console

### Error: "invalid_client"
- **Causa**: Client ID o Client Secret incorrectos
- **Solución**: Verifica que copiaste correctamente las credenciales en tu archivo `.env`

### Error: "access_denied"
- **Causa**: El usuario rechazó los permisos o la cuenta no está en usuarios de prueba
- **Solución**: Asegúrate de agregar tu cuenta de Google en "Usuarios de prueba" en la pantalla de consentimiento

### No se muestra la pantalla de Google
- **Causa**: El backend no está corriendo o las URLs no coinciden
- **Solución**: Verifica que el backend esté corriendo en http://localhost:3000 y que el botón redirige a la URL correcta

## Configuración para Producción

Cuando estés listo para producción, deberás:

1. Actualizar la **Pantalla de consentimiento** para cambiar el tipo a "Interno" o completar el proceso de verificación
2. Agregar los dominios de producción a:
   - **Orígenes de JavaScript autorizados**
   - **URIs de redireccionamiento autorizados**
3. Actualizar las variables de entorno en tu servidor de producción

**Ejemplo para producción**:
```env
GOOGLE_CALLBACK_URL=https://tu-dominio.com/savesmarth/api/v1/login/google/callback
FRONTEND_URL=https://tu-dominio.com
```

## Seguridad

⚠️ **NUNCA** compartas tu Client Secret públicamente
⚠️ **NUNCA** subas tu archivo `.env` a repositorios públicos
✅ Agrega `.env` a tu `.gitignore`
✅ Usa variables de entorno en producción
✅ Cambia el `JWT_SECRET` en producción

## Recursos Adicionales

- [Documentación oficial de Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Guía de Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [NestJS Passport Integration](https://docs.nestjs.com/security/authentication)
