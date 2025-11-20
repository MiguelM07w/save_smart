# 📸 Configuración de Cloudinary para SaveSmart

## ✅ Implementación Completada

Se ha implementado exitosamente la funcionalidad de subida de fotos de perfil usando Cloudinary.

---

## 🎯 Características Implementadas

### Para Usuarios:
- ✅ Subir foto de perfil desde `/user/profile`
- ✅ Vista previa inmediata de la foto
- ✅ Avatar muestra foto o inicial del username
- ✅ Validación de tamaño (máx 2MB)
- ✅ Validación de formato (JPG, PNG, WEBP)

### Para Administradores:
- ✅ Gestionar fotos de usuarios desde `/admin/users`
- ✅ Modal de edición con campo de foto
- ✅ Mismas validaciones y preview

---

## 🔧 Configuración Actual

### Variables de Entorno (`.env`):
```env
VITE_CLOUDINARY_CLOUD_NAME=djuroihfa
VITE_CLOUDINARY_UPLOAD_PRESET=savesmart_profiles
```

### Configuración de Cloudinary:
- **Cloud Name:** djuroihfa
- **Upload Preset:** savesmart_profiles
- **Modo:** Unsigned (seguro para frontend)
- **Carpeta:** profiles/
- **Límite de tamaño:** 2MB
- **Formatos permitidos:** JPG, PNG, WEBP

---

## 🚀 Cómo Funciona

### 1. Usuario sube una foto
```
1. Usuario selecciona archivo desde su dispositivo
2. Frontend valida tipo y tamaño
3. Se muestra preview local inmediatamente
4. Archivo se sube a Cloudinary
5. Cloudinary devuelve URL de la imagen
6. URL se guarda en la base de datos (campo "photo")
7. La foto se muestra en el avatar
```

### 2. Estructura de Datos

**Base de Datos (MongoDB - Colección Login):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "juan",
  "email": "juan@example.com",
  "password": "$2b$10$...",
  "photo": "https://res.cloudinary.com/djuroihfa/image/upload/v1234567890/profiles/abc123.jpg",
  "rol": "Usuario"
}
```

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
1. `src/hooks/useCloudinary.ts` - Hook para subida de imágenes
2. `.env` - Variables de entorno de Cloudinary
3. `.env.example` - Plantilla de variables
4. `CLOUDINARY_SETUP.md` - Esta documentación

### Archivos Modificados:
1. `src/pages/user/UserProfile.tsx` - Campo de foto añadido
2. `src/pages/user/UserProfile.css` - Estilos de foto
3. `src/features/users/UserForm.tsx` - Foto en formulario admin
4. `src/features/users/UsersPage.css` - Estilos adicionales
5. `src/layouts/UserLayout.tsx` - Avatar con foto en header
6. `src/layouts/UserLayout.css` - Estilos de avatar

---

## 🎨 Componentes de UI

### Avatar en Header (UserLayout):
```tsx
<div className="user-avatar-small">
  {user?.photo ? (
    <img src={user.photo} alt="Avatar" className="avatar-image-small" />
  ) : (
    <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
  )}
</div>
```

### Campo de Foto en UserProfile:
```tsx
<div className="photo-upload-section">
  <div className="photo-preview">
    {photoPreview ? (
      <img src={photoPreview} alt="Preview" className="preview-image" />
    ) : (
      <div className="preview-placeholder">
        <span>{authUser?.username?.charAt(0).toUpperCase()}</span>
      </div>
    )}
  </div>
  <div className="photo-upload-controls">
    <label htmlFor="photo-input" className="photo-upload-label">
      {uploadingPhoto ? '⏳ Subiendo...' : '📷 Cambiar Foto'}
    </label>
    <input
      id="photo-input"
      type="file"
      accept="image/*"
      onChange={handlePhotoChange}
      disabled={uploadingPhoto}
      className="photo-input"
    />
  </div>
</div>
```

---

## 🔒 Seguridad

### ¿Es seguro exponer Cloud Name y Upload Preset?
✅ **SÍ**, porque:
- El upload preset está configurado como "unsigned"
- No expone el API Secret
- Solo permite subir a la carpeta "profiles/"
- Cloudinary tiene protección contra abuso
- Límites de tamaño y formato configurados

### Protecciones Implementadas:
```typescript
// Frontend valida:
- Tipo de archivo (solo imágenes)
- Tamaño máximo (2MB)
- Extensiones permitidas

// Cloudinary valida:
- Upload preset válido
- Límites de tamaño
- Formatos permitidos
- Rate limiting automático
```

---

## 📊 Plan Gratuito de Cloudinary

| Recurso | Límite Gratuito | Uso Estimado |
|---------|-----------------|--------------|
| Almacenamiento | 25 GB | ~25,000 fotos de 1MB |
| Ancho de banda | 25 GB/mes | ~25,000 vistas/mes |
| Transformaciones | Ilimitadas | Sin límite |
| Usuarios | Sin límite | Sin límite |

### Ejemplo de Uso Real:
- **1,000 usuarios** con foto de **500KB** = **500 MB** de almacenamiento
- Muy lejos del límite de 25 GB

---

## 🌐 Al Desplegar en Producción

### 1. Frontend (Vercel, Netlify, etc.):
**Configurar variables de entorno en el panel:**
```
VITE_CLOUDINARY_CLOUD_NAME=djuroihfa
VITE_CLOUDINARY_UPLOAD_PRESET=savesmart_profiles
```

### 2. Backend (Railway, Render, etc.):
**No requiere cambios:**
- El backend solo recibe y guarda URLs como strings
- No necesita credenciales de Cloudinary
- Las URLs son permanentes y globales

### 3. Base de Datos:
**No requiere cambios:**
- El campo `photo` ya existe en el schema de Login
- Acepta strings (URLs)

---

## 🧪 Cómo Probar

### 1. Usuario Normal:
```bash
# Iniciar frontend
pnpm run dev

# Navegar a http://localhost:5173
1. Login con usuario normal
2. Ir a "Mi Perfil" o "Configuración"
3. Clic en "📷 Cambiar Foto"
4. Seleccionar una imagen (máx 2MB)
5. Ver preview inmediato
6. Clic en "💾 Guardar Cambios"
7. Ver foto en el avatar del header
```

### 2. Administrador:
```bash
1. Login como admin
2. Ir a "Usuarios"
3. Clic en "✏️" en cualquier usuario
4. Subir foto en el modal
5. Guardar cambios
```

---

## ❓ FAQ

### ¿Qué pasa si un usuario no sube foto?
Se muestra la inicial de su username en un avatar con degradado morado-azul.

### ¿Puedo cambiar la carpeta de Cloudinary?
Sí, edita el hook `useCloudinary.ts` línea 31:
```typescript
formData.append('folder', 'tu_carpeta_nueva');
```

### ¿Cómo cambiar el tamaño máximo?
Edita las validaciones en:
- `UserProfile.tsx` línea 63
- `UserForm.tsx` línea 107

### ¿Las fotos se pierden si cambio de hosting?
No, las fotos están en Cloudinary (no en tu servidor).

### ¿Puedo usar otra solución en lugar de Cloudinary?
Sí, solo reemplaza el hook `useCloudinary.ts` con otra implementación (AWS S3, Base64, etc.)

---

## 🐛 Troubleshooting

### Error: "Upload preset not found"
**Solución:** Verifica que el preset esté configurado como "unsigned" en Cloudinary.

### Error: "Invalid cloud name"
**Solución:** Verifica que la variable `VITE_CLOUDINARY_CLOUD_NAME` esté correcta en `.env`

### Las fotos no se muestran
**Solución:** Verifica que el usuario tenga el campo `photo` en la base de datos.

### Error CORS
**Solución:** Cloudinary permite CORS por defecto, pero verifica tu configuración.

---

## 📞 Soporte

Para más información sobre Cloudinary:
- Documentación: https://cloudinary.com/documentation
- Dashboard: https://cloudinary.com/console
- Soporte: https://support.cloudinary.com

---

✅ **Implementación completada y lista para usar**
