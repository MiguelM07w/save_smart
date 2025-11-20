# 🚀 Inicio Rápido - SaveSmarth

Guía rápida para iniciar el proyecto SaveSmarth (Backend + Frontend)

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js** (v18 o superior)
- ✅ **pnpm** (gestor de paquetes)
- ✅ **MongoDB** (v8.6.1 o superior)

### Instalar pnpm (si no lo tienes)

```bash
npm install -g pnpm
```

## 🔧 Configuración Inicial

### 1. Iniciar MongoDB

Asegúrate de que MongoDB esté corriendo:

```bash
# En Windows
mongod

# O si instalaste MongoDB como servicio, debería estar corriendo automáticamente
```

Verificar que MongoDB esté en: `mongodb://localhost:27017`

### 2. Backend (API)

```bash
# Navegar a la carpeta del backend
cd savesmarthapi

# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm run start:dev
```

El backend estará disponible en: **http://localhost:3000**

#### Endpoints del Backend:
- Base URL: `http://localhost:3000/savesmarth/api/v1`
- Ejemplo: `http://localhost:3000/savesmarth/api/v1/students`

### 3. Frontend (React App)

En una nueva terminal:

```bash
# Navegar a la carpeta del frontend
cd savesmarthfrontend

# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm run dev
```

El frontend estará disponible en: **http://localhost:3001**

## 🎯 Acceder a la Aplicación

1. **Página Principal**: Abre http://localhost:3001
2. **Crear una cuenta**: Click en "Registrarse"
3. **Iniciar sesión**: Usa tus credenciales
4. **Dashboard**: Accede al panel de control

## 📁 Estructura del Proyecto

```
save_smart/
├── savesmarthapi/           # Backend (NestJS)
│   ├── src/
│   │   ├── students/
│   │   ├── users/
│   │   ├── login/
│   │   ├── payment/
│   │   ├── reports/
│   │   ├── income/
│   │   └── expense/
│   └── package.json
│
├── savesmarthfrontend/      # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── features/        # Módulos
│   │   ├── pages/           # Páginas
│   │   ├── components/      # Componentes
│   │   ├── services/        # API services
│   │   └── store/           # Redux
│   └── package.json
│
├── API_SAVESMARTH_RESUMEN.md  # Documentación del API
└── INICIO_RAPIDO.md           # Este archivo
```

## 🔑 Módulos Disponibles

### ✅ Completamente Implementados:

1. **Autenticación** - Login y registro de usuarios
2. **Dashboard** - Panel principal con estadísticas
3. **Estudiantes** - CRUD completo con formularios

### ⏳ Pendientes (Usar Estudiantes como template):

4. **Usuarios** - Gestión de personal
5. **Pagos** - Control de pagos y cuotas
6. **Reportes** - Reportes médicos
7. **Ingresos** - Gestión de ingresos
8. **Gastos** - Control de gastos

## 📝 Cómo Crear Nuevos Módulos

Para crear los módulos pendientes, sigue estos pasos:

### 1. Identificar el módulo a crear

Ejemplo: **Usuarios**, **Pagos**, **Reportes**, etc.

### 2. Copiar el template de Estudiantes

```bash
# En el frontend:
cd savesmarthfrontend/src/features

# Copiar la carpeta students como template
cp -r students users        # Para módulo de usuarios
# o
cp -r students payments     # Para módulo de pagos
```

### 3. Adaptar los archivos

**Archivos a modificar:**
- `[Modulo]Page.tsx` - Lista y tabla del módulo
- `[Modulo]Form.tsx` - Formulario de creación/edición
- `[Modulo]Page.css` - Estilos (generalmente no requiere cambios)

**Cambios necesarios:**
1. Cambiar todos los imports de `Student` a tu entidad (ej: `User`, `Payment`)
2. Adaptar los campos del formulario según el schema del backend
3. Actualizar las columnas de la tabla
4. Cambiar los textos (títulos, labels, placeholders)

### 4. Agregar la ruta en App.tsx

```typescript
// En App.tsx
import UsersPage from './features/users/UsersPage';

// En las rutas:
<Route path="users" element={<UsersPage />} />
```

### 5. El servicio de API ya está listo

Todos los servicios ya están implementados en `src/services/api.service.ts`:
- `usersApi`
- `paymentsApi`
- `reportsApi`
- `incomeApi`
- `expenseApi`

## 🎨 Componentes Disponibles

El proyecto ya incluye componentes reutilizables:

- `<Button>` - Botones con variantes
- `<Input>` - Inputs con validación
- `<Modal>` - Modales
- `<Loading>` - Indicadores de carga

Ver: `src/components/common/`

## 🛠️ Comandos Útiles

### Backend
```bash
pnpm run start:dev    # Modo desarrollo
pnpm run build        # Compilar
pnpm run start:prod   # Producción
```

### Frontend
```bash
pnpm run dev         # Modo desarrollo
pnpm run build       # Compilar
pnpm run preview     # Preview del build
```

## 📊 Base de Datos

MongoDB se conecta automáticamente a:
```
URI: mongodb://localhost:27017/savesmarth
```

### Colecciones creadas automáticamente:
- `logins` - Cuentas de usuarios
- `students` - Estudiantes/Pacientes
- `users` - Personal médico
- `payments` - Pagos
- `reports` - Reportes médicos
- `incomes` - Ingresos
- `expenses` - Gastos

## 🐛 Troubleshooting

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si falla, iniciar MongoDB:
mongod --dbpath C:\data\db
```

### El backend no inicia
```bash
# Verificar puerto 3000 disponible
netstat -ano | findstr :3000

# Reinstalar dependencias
cd savesmarthapi
rm -rf node_modules
pnpm install
```

### El frontend no inicia
```bash
# Verificar puerto 3001 disponible
netstat -ano | findstr :3001

# Reinstalar dependencias
cd savesmarthfrontend
rm -rf node_modules
pnpm install
```

### Error de CORS
El backend ya está configurado para aceptar requests de `http://localhost:3001`

## 📚 Documentación Completa

- **Backend API**: Ver `API_SAVESMARTH_RESUMEN.md`
- **Frontend**: Ver `savesmarthfrontend/README.md`
- **Tipos**: Ver `savesmarthfrontend/src/types/index.ts`

## 🎯 Próximos Pasos

1. ✅ Familiarízate con el módulo de Estudiantes
2. ✅ Crea el módulo de Usuarios siguiendo el template
3. ✅ Continúa con Pagos, Reportes, Ingresos y Gastos
4. ✅ Personaliza los estilos según tus necesidades
5. ✅ Agrega más gráficas al Dashboard

## 💡 Tips

- **Redux DevTools**: Instala la extensión para ver el estado de Redux
- **React DevTools**: Instala la extensión para debuggear componentes
- **Thunder Client / Postman**: Útil para probar los endpoints del backend
- **MongoDB Compass**: Interface gráfica para MongoDB

## 📞 Soporte

Si tienes preguntas o encuentras errores:
1. Revisa la documentación en `API_SAVESMARTH_RESUMEN.md`
2. Verifica que todos los servicios estén corriendo
3. Revisa la consola del navegador para errores del frontend
4. Revisa la consola del terminal para errores del backend

---

**¡Listo! Tu sistema SaveSmarth está configurado y funcionando! 🎉**

**Frontend**: http://localhost:3001
**Backend**: http://localhost:3000
**MongoDB**: mongodb://localhost:27017/savesmarth
