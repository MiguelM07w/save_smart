# SaveSmarth Frontend

Frontend completo para el sistema de gestión SaveSmarth, desarrollado con React, TypeScript, Redux, React Query y más.

## 🚀 Tecnologías Utilizadas

- **React** 19.2.0 - Biblioteca UI
- **TypeScript** 5.9.3 - Tipado estático
- **Vite** 7.2.2 - Build tool y dev server
- **React Router DOM** 7.9.5 - Routing
- **Redux Toolkit** 2.10.1 - Manejo de estado global
- **React Query** 5.90.7 - Manejo de estado del servidor
- **Axios** 1.13.2 - Cliente HTTP
- **React Hook Form** 7.66.0 - Manejo de formularios
- **Yup** 1.7.1 - Validación de esquemas
- **Recharts** 3.3.0 - Gráficas y visualizaciones
- **React Hot Toast** 2.6.0 - Notificaciones
- **Lodash** 4.17.21 - Utilidades
- **date-fns** 4.1.0 - Manejo de fechas
- **pnpm** - Gestor de paquetes

## 📦 Instalación

```bash
# Instalar dependencias
cd savesmarthfrontend
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Construir para producción
pnpm run build

# Previsualizar build de producción
pnpm run preview
```

## 🏗️ Estructura del Proyecto

```
savesmarthfrontend/
├── src/
│   ├── assets/              # Recursos estáticos
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── global.css   # Estilos globales
│   │
│   ├── components/          # Componentes reutilizables
│   │   ├── common/          # Componentes comunes
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   ├── forms/           # Componentes de formularios
│   │   ├── tables/          # Componentes de tablas
│   │   ├── modals/          # Modales
│   │   └── charts/          # Gráficas
│   │
│   ├── config/              # Configuraciones
│   │   ├── axios.config.ts  # Configuración de Axios
│   │   └── react-query.config.ts  # Configuración de React Query
│   │
│   ├── features/            # Módulos de la aplicación
│   │   ├── auth/            # Autenticación
│   │   ├── students/        # Estudiantes
│   │   │   ├── StudentsPage.tsx
│   │   │   ├── StudentForm.tsx
│   │   │   └── StudentsPage.css
│   │   ├── users/           # Usuarios
│   │   ├── payments/        # Pagos
│   │   ├── reports/         # Reportes
│   │   ├── income/          # Ingresos
│   │   ├── expense/         # Gastos
│   │   └── dashboard/       # Dashboard
│   │
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.ts       # Hook de autenticación
│   │
│   ├── layouts/             # Layouts de páginas
│   │   ├── DashboardLayout.tsx
│   │   └── DashboardLayout.css
│   │
│   ├── pages/               # Páginas principales
│   │   ├── landing/         # Página de inicio
│   │   │   ├── LandingPage.tsx
│   │   │   └── LandingPage.css
│   │   ├── auth/            # Páginas de autenticación
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── AuthPages.css
│   │   └── dashboard/       # Dashboard principal
│   │       ├── DashboardHome.tsx
│   │       └── DashboardHome.css
│   │
│   ├── services/            # Servicios de API
│   │   └── api.service.ts   # Servicio de API principal
│   │
│   ├── store/               # Redux store
│   │   ├── slices/          # Slices de Redux
│   │   │   └── authSlice.ts
│   │   ├── index.ts         # Configuración del store
│   │   └── hooks.ts         # Hooks tipados de Redux
│   │
│   ├── types/               # Tipos de TypeScript
│   │   └── index.ts         # Tipos principales
│   │
│   ├── utils/               # Utilidades
│   │   └── helpers.ts       # Funciones helper
│   │
│   ├── validations/         # Esquemas de validación
│   │   ├── auth.validation.ts
│   │   ├── student.validation.ts
│   │   └── payment.validation.ts
│   │
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Punto de entrada
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── pnpm-lock.yaml
└── README.md
```

## 🎯 Características Principales

### ✅ Implementadas

- ✓ Sistema de autenticación con Redux
- ✓ Rutas protegidas con React Router
- ✓ Landing page completa con secciones
- ✓ Dashboard con estadísticas y gráficas
- ✓ Módulo de Estudiantes completo (CRUD)
- ✓ Integración con React Query para caché
- ✓ Validación de formularios con Yup
- ✓ Notificaciones con React Hot Toast
- ✓ Manejo de errores global
- ✓ Componentes reutilizables
- ✓ Estilos responsivos
- ✓ TypeScript en toda la aplicación

### 📋 Pendientes (Usar módulo de Estudiantes como template)

- ⏳ Módulo de Usuarios (CRUD)
- ⏳ Módulo de Pagos (CRUD)
- ⏳ Módulo de Reportes (CRUD)
- ⏳ Módulo de Ingresos (CRUD)
- ⏳ Módulo de Gastos (CRUD)
- ⏳ Página de Analytics con más gráficas
- ⏳ Página de Perfil de usuario
- ⏳ Página de Configuración

## 🔌 Endpoints del Backend

El frontend está configurado para conectarse a:

```
Base URL: http://localhost:3000/savesmarth/api/v1
CORS: http://localhost:3001
```

### Endpoints disponibles:

- **Auth:** `/login`, `/login/register`
- **Students:** `/students`, `/students/:id`
- **Users:** `/users`, `/users/:id`
- **Payments:** `/payments`, `/payments/:id`
- **Reports:** `/reports`, `/reports/:id`
- **Income:** `/incomes`, `/incomes/:id`
- **Expense:** `/expenses`, `/expenses/:id`

Ver `API_SAVESMARTH_RESUMEN.md` en la raíz del proyecto para documentación completa del backend.

## 📝 Cómo Crear Nuevos Módulos

Usa el módulo de **Estudiantes** como template para crear otros módulos:

### 1. Crear el archivo de página principal

```typescript
// features/[modulo]/[Modulo]Page.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// ... importar servicios, componentes, etc.

const [Modulo]Page: React.FC = () => {
  // Similar a StudentsPage.tsx
  // Adaptar campos según el schema del módulo
};
```

### 2. Crear el formulario

```typescript
// features/[modulo]/[Modulo]Form.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
// ... importar validaciones, etc.

const [Modulo]Form: React.FC = ({ item, onSuccess }) => {
  // Similar a StudentForm.tsx
  // Adaptar campos según el schema del módulo
};
```

### 3. Crear los estilos

```css
/* features/[modulo]/[Modulo]Page.css */
/* Copiar de StudentsPage.css y adaptar si es necesario */
```

### 4. Agregar la ruta en App.tsx

```typescript
// En App.tsx
import [Modulo]Page from './features/[modulo]/[Modulo]Page';

// En las rutas del dashboard:
<Route path="[ruta]" element={<[Modulo]Page />} />
```

## 🎨 Estilos y Temas

### Variables CSS Globales

El proyecto usa variables CSS definidas en `assets/styles/global.css`:

```css
--primary-color: #3b82f6
--success-color: #22c55e
--danger-color: #ef4444
--warning-color: #f59e0b
--info-color: #06b6d4
```

### Clases Utilitarias

- `.btn` - Botones
- `.card` - Tarjetas
- `.input` - Inputs
- `.table` - Tablas
- `.badge` - Badges
- `.modal` - Modales

Ver `global.css` para todas las clases disponibles.

## 🔐 Autenticación

El sistema de autenticación usa:

1. **Redux** para el estado global del usuario
2. **LocalStorage** para persistir la sesión
3. **Axios Interceptors** para agregar tokens
4. **Protected Routes** para rutas privadas

### Flujo de Autenticación

```
1. Usuario hace login → POST /login
2. Backend valida y retorna datos del usuario
3. Redux guarda el usuario en el store
4. LocalStorage persiste el usuario
5. Axios interceptor agrega token a requests
6. ProtectedRoute verifica autenticación
```

## 📊 Manejo de Estado

### Estado Global (Redux)

- **authSlice**: Maneja autenticación y usuario actual

### Estado del Servidor (React Query)

- Caché de datos del servidor
- Revalidación automática
- Mutaciones con invalidación de caché

```typescript
// Ejemplo de uso:
const { data, isLoading } = useQuery({
  queryKey: ['students'],
  queryFn: studentsApi.getAll,
});

const mutation = useMutation({
  mutationFn: studentsApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  },
});
```

## 🛠️ Utilidades

### Helpers Disponibles (`utils/helpers.ts`)

**Fechas:**
- `formatDate(date, format)` - Formatear fechas
- `formatDateTime(date)` - Fecha y hora
- `formatRelativeTime(date)` - Tiempo relativo

**Moneda:**
- `formatCurrency(amount)` - Formato de moneda MXN

**Strings:**
- `truncateText(text, length)` - Truncar texto
- `capitalizeFirstLetter(str)` - Capitalizar
- `getInitials(name, lastname)` - Obtener iniciales

**Arrays:**
- `sortArray(array, key, order)` - Ordenar arrays
- `filterBySearch(items, term, keys)` - Filtrar por búsqueda

**Validaciones:**
- `isValidEmail(email)` - Validar email
- `isValidCURP(curp)` - Validar CURP

**Y más...**

## 🚨 Manejo de Errores

### Interceptor de Axios

Los errores HTTP se manejan automáticamente:

- **401**: Redirige a login
- **403**: Muestra error de permisos
- **404**: Muestra error de no encontrado
- **500**: Muestra error del servidor

### Toast Notifications

```typescript
import toast from 'react-hot-toast';

toast.success('Operación exitosa');
toast.error('Algo salió mal');
toast.loading('Cargando...');
```

## 📱 Responsive Design

El diseño es completamente responsive con breakpoints en:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm run dev              # Inicia servidor de desarrollo (puerto 3001)

# Producción
pnpm run build            # Construir para producción
pnpm run preview          # Previsualizar build

# Linting
pnpm run lint             # Ejecutar ESLint
```

## 🌐 Variables de Entorno

Crear un archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:3000/savesmarth/api/v1
VITE_APP_NAME=SaveSmarth
```

## 📚 Documentación Adicional

- **Backend API**: Ver `../API_SAVESMARTH_RESUMEN.md`
- **Tipos**: Ver `src/types/index.ts`
- **Servicios**: Ver `src/services/api.service.ts`
- **Validaciones**: Ver `src/validations/`

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. Crear la funcionalidad siguiendo la estructura existente
2. Usar TypeScript para todo el código
3. Agregar validaciones con Yup
4. Crear componentes reutilizables cuando sea posible
5. Documentar cambios importantes

## 📄 Licencia

Este proyecto fue generado automáticamente para SaveSmarth.

---

**Desarrollado con ❤️ usando React + TypeScript + Vite**

**Puerto del Frontend**: `http://localhost:3001`
**Puerto del Backend**: `http://localhost:3000`
