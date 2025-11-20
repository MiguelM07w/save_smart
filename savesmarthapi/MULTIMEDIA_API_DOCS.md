# 📚 API de Multimedia - SaveSmart

## ✅ Implementación Completada

Se han creado 2 módulos completos en el backend:
- **Video** - Gestión de videos educativos (YouTube)
- **Article** - Gestión de artículos, tips y noticias

---

## 📺 API de Videos

### **Base URL:** `/video`

### **Endpoints:**

#### 1. Crear Video
```http
POST /video
Content-Type: application/json

{
  "title": "Cómo hacer un presupuesto mensual",
  "description": "Aprende a crear tu presupuesto desde cero...",
  "youtubeId": "abc123",
  "thumbnail": "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
  "duration": 330,
  "durationFormatted": "5:30",
  "category": "Presupuesto",
  "tags": ["presupuesto", "principiante"],
  "isOwnContent": true,
  "author": "SaveSmart Academy",
  "level": "principiante",
  "isFeatured": true,
  "isPublished": true
}
```

#### 2. Obtener Todos los Videos
```http
GET /video
```

#### 3. Obtener Videos Publicados
```http
GET /video/published
```

#### 4. Obtener Videos por Categoría
```http
GET /video/category/Presupuesto
GET /video/category/Ahorro
GET /video/category/Inversión
GET /video/category/Deudas
GET /video/category/Educación%20Financiera
GET /video/category/Tips
```

#### 5. Obtener Videos Destacados
```http
GET /video/featured
```

#### 6. Obtener Video por ID
```http
GET /video/:id
```

#### 7. Actualizar Video
```http
PUT /video/:id
Content-Type: application/json

{
  "title": "Nuevo título",
  "isPublished": false
}
```

#### 8. Incrementar Vistas
```http
PATCH /video/:id/view
```

#### 9. Eliminar Video (Soft Delete)
```http
DELETE /video/:id
```

#### 10. Restaurar Video
```http
PATCH /video/:id/restore
```

---

## 📰 API de Artículos

### **Base URL:** `/article`

### **Endpoints:**

#### 1. Crear Artículo
```http
POST /article
Content-Type: application/json

{
  "title": "5 formas de ahorrar $100 esta semana",
  "slug": "5-formas-ahorrar-100-esta-semana",
  "excerpt": "Descubre cómo ahorrar $100 en una semana...",
  "content": "# 5 formas de ahorrar\n\n## 1. Prepara tu comida...",
  "type": "tip",
  "category": "Ahorro",
  "coverImage": "https://res.cloudinary.com/djuroihfa/image/upload/v123/articles/ahorro.jpg",
  "tags": ["ahorro", "tips"],
  "author": "María González",
  "readingTime": 3,
  "isOwnContent": true,
  "level": "principiante",
  "isFeatured": true,
  "isPublished": true
}
```

#### 2. Obtener Todos los Artículos
```http
GET /article
```

#### 3. Obtener Artículos Publicados
```http
GET /article/published
```

#### 4. Obtener Artículos por Tipo
```http
GET /article/type/tip
GET /article/type/noticia
GET /article/type/guia
```

#### 5. Obtener Artículos por Categoría
```http
GET /article/category/Ahorro
GET /article/category/Inversión
GET /article/category/Presupuesto
GET /article/category/Deudas
GET /article/category/General
```

#### 6. Obtener Artículos Destacados
```http
GET /article/featured
```

#### 7. Obtener Artículo por Slug
```http
GET /article/slug/5-formas-ahorrar-100-esta-semana
```

#### 8. Obtener Artículo por ID
```http
GET /article/:id
```

#### 9. Actualizar Artículo
```http
PUT /article/:id
Content-Type: application/json

{
  "title": "Nuevo título",
  "content": "Nuevo contenido..."
}
```

#### 10. Incrementar Vistas
```http
PATCH /article/:id/view
```

#### 11. Eliminar Artículo (Soft Delete)
```http
DELETE /article/:id
```

#### 12. Restaurar Artículo
```http
PATCH /article/:id/restore
```

---

## 📊 Schemas Creados

### Video Schema
```typescript
{
  title: string (requerido)
  description: string (requerido)
  youtubeId: string (requerido)
  thumbnail?: string
  duration?: number
  durationFormatted?: string
  category: VideoCategory (requerido)
  tags?: string[]
  isOwnContent?: boolean
  author?: string
  order?: number
  isFeatured?: boolean
  isPublished?: boolean
  level?: VideoLevel
  views?: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
```

### Article Schema
```typescript
{
  title: string (requerido)
  slug: string (requerido, único)
  excerpt?: string
  content: string (requerido)
  type: ArticleType (requerido)
  category: ArticleCategory (requerido)
  coverImage?: string
  tags?: string[]
  author: string (requerido)
  authorId?: string
  readingTime?: number
  isOwnContent?: boolean
  externalUrl?: string
  source?: string
  isPublished?: boolean
  isFeatured?: boolean
  publishedAt?: Date
  order?: number
  views?: number
  level?: ArticleLevel
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
```

---

## 🎯 Enums

### VideoCategory
```typescript
'Presupuesto'
'Ahorro'
'Inversión'
'Deudas'
'Educación Financiera'
'Tips'
```

### ArticleType
```typescript
'tip'
'noticia'
'guia'
```

### ArticleCategory
```typescript
'Ahorro'
'Inversión'
'Presupuesto'
'Deudas'
'General'
```

### Level (Video y Article)
```typescript
'principiante'
'intermedio'
'avanzado'
```

---

## 🗂️ Estructura de Archivos Creados

```
src/
├── video/
│   ├── schema/
│   │   └── video.schema.ts
│   ├── dto/
│   │   ├── createvideo.dto.ts
│   │   └── updatevideo.dto.ts
│   ├── video.controller.ts
│   ├── video.service.ts
│   └── video.module.ts
│
├── article/
│   ├── schema/
│   │   └── article.schema.ts
│   ├── dto/
│   │   ├── createarticle.dto.ts
│   │   └── updatearticle.dto.ts
│   ├── article.controller.ts
│   ├── article.service.ts
│   └── article.module.ts
│
└── app.module.ts (actualizado)
```

---

## 🚀 Cómo Probar

### 1. Iniciar el servidor
```bash
cd savesmarthapi
npm run start:dev
```

### 2. Crear un video de prueba
```bash
curl -X POST http://localhost:3000/video \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Presupuesto para principiantes",
    "description": "Aprende a hacer tu primer presupuesto",
    "youtubeId": "dQw4w9WgXcQ",
    "category": "Presupuesto",
    "level": "principiante",
    "isPublished": true
  }'
```

### 3. Obtener videos publicados
```bash
curl http://localhost:3000/video/published
```

### 4. Crear un artículo de prueba
```bash
curl -X POST http://localhost:3000/article \
  -H "Content-Type: application/json" \
  -d '{
    "title": "10 tips para ahorrar dinero",
    "slug": "10-tips-ahorrar-dinero",
    "content": "Aquí van los tips...",
    "type": "tip",
    "category": "Ahorro",
    "author": "SaveSmart Team",
    "isPublished": true
  }'
```

---

## 📝 Notas Importantes

1. **Soft Delete**: Todos los registros usan soft delete (campo `deletedAt`)
2. **Timestamps**: Campos `createdAt` y `updatedAt` se manejan automáticamente
3. **Validación**: Todos los DTOs tienen validación con class-validator
4. **Índices**: Article tiene índices en `slug`, `category` y `publishedAt`
5. **YouTube URL**: El `youtubeId` se usa para embeber: `https://www.youtube.com/embed/{youtubeId}`
6. **Thumbnail**: Auto-generable con: `https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg`
7. **Slug**: Debe ser único para cada artículo (para URLs amigables)

---

## ✅ Siguiente Paso

**Backend completado.** Ahora puedes:

1. Probar los endpoints con Postman/Thunder Client
2. Crear seed data (videos y artículos iniciales)
3. Esperar indicaciones para implementar el frontend

---

✅ **Implementación del backend completada exitosamente**
