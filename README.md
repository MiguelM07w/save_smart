# SaveSmarth - Sistema de Gestión Financiera

Sistema completo de gestión financiera con frontend en React + Vite y backend en NestJS.

## 🚀 Estructura del Proyecto

```
save_smart/
├── savesmarthapi/       # Backend (NestJS)
└── savesmarthfrontend/  # Frontend (React + Vite + TypeScript)
```

## 📦 Tecnologías

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **React Router v7** para navegación
- **TanStack Query** para manejo de estado del servidor
- **Redux Toolkit** para estado global
- **Recharts** para gráficas
- **React Hot Toast** para notificaciones

### Backend
- **NestJS** framework
- **MongoDB** base de datos
- **Passport.js** autenticación
- **JWT** tokens
- **Google OAuth** login social
- **Nodemailer** envío de emails

## 🛠️ Instalación

### Backend (API)

```bash
cd savesmarthapi
npm install
```

Crear archivo `.env` con:
```env
JWT_SECRET=tu-secret-key
MONGODB_URI=mongodb://localhost:27017/savesmarth
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
FRONTEND_URL=http://localhost:3001
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/savesmarth/api/v1/login/google/callback
```

Iniciar servidor:
```bash
npm run start:dev
```

El servidor correrá en `http://localhost:3000`

### Frontend

```bash
cd savesmarthfrontend
npm install
npm run dev
```

El frontend correrá en `http://localhost:3001`

## 📁 Estructura de Carpetas

### Frontend
```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizables
├── features/        # Módulos por funcionalidad
├── hooks/           # Custom hooks
├── layouts/         # Layouts principales
│   └── styles/      # Estilos de layouts
├── pages/           # Páginas de la aplicación
│   ├── admin/       # Páginas de administrador
│   │   └── styles/
│   ├── auth/        # Páginas de autenticación
│   │   └── styles/
│   ├── landing/     # Página de inicio
│   └── user/        # Páginas de usuario
│       └── styles/
├── routes/          # Configuración de rutas
├── services/        # Servicios API
├── store/           # Redux store
├── types/           # TypeScript types
└── utils/           # Utilidades

```

### Backend
```
src/
├── auth/            # Módulo de autenticación
├── config/          # Configuraciones
├── email/           # Servicio de email
├── features/        # Módulos de funcionalidades
│   ├── articles/
│   ├── expenses/
│   ├── income/
│   ├── payments/
│   ├── users/
│   └── videos/
└── schemas/         # Schemas de MongoDB
```

## 👤 Usuarios

El sistema cuenta con dos tipos de usuarios:

### Administrador
- Dashboard con estadísticas generales
- Gestión de ingresos y gastos
- Gestión de usuarios
- Gestión de pagos
- Gestión de contenido (videos y artículos)

### Usuario Regular
- Dashboard personal
- Registro de ingresos y gastos propios
- Visualización de gráficas y estadísticas
- Acceso a contenido educativo
- Gestión de perfil

## 🔐 Características de Seguridad

- Autenticación JWT
- Google OAuth 2.0
- Recuperación de contraseña por email
- Protección de rutas
- Validación de datos
- CORS configurado

## 📊 Funcionalidades Principales

- ✅ Gestión de ingresos y gastos
- ✅ Visualización con gráficas interactivas
- ✅ Exportación a PDF y CSV
- ✅ Sistema de roles (Admin/User)
- ✅ Contenido educativo (videos y artículos)
- ✅ Notificaciones en tiempo real
- ✅ Perfil de usuario con foto
- ✅ Responsive design

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso educativo.

## 👨‍💻 Autor

Desarrollado con ❤️ por el equipo de SaveSmarth
