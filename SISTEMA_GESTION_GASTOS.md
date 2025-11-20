# 💰 Sistema de Gestión de Gastos - SaveSmarth

Sistema completo de gestión de gastos personales y empresariales con roles diferenciados (Administrador y Usuario).

## 🎯 Descripción del Sistema

**SaveSmarth** es una aplicación web completa para gestionar ingresos, gastos y obtener análisis financieros detallados. El sistema cuenta con dos roles principales:

### 👤 **ROL USUARIO**
- Dashboard personalizado con sus propios ingresos y gastos
- Gráficas de análisis personal
- Exportación de estadísticas en PDF y CSV
- Gestión de sus propios ingresos y gastos
- Visualización de tendencias mensuales

### 👨‍💼 **ROL ADMINISTRADOR**
- Dashboard global con estadísticas de todos los usuarios
- Gestión completa de usuarios
- Vista global de ingresos y gastos del sistema
- Gestión de pagos
- Exportación de reportes globales
- Acceso a todos los módulos CRUD

## 🚀 Características Implementadas

### ✅ Sistema de Autenticación
- Login con validación
- Registro (por defecto crea usuarios con rol "Usuario")
- El administrador asigna roles desde el panel de administración
- Redirección automática según rol:
  - **Administrador** → `/admin/dashboard`
  - **Usuario** → `/user/dashboard`

### ✅ Dashboard de Usuario
- **Tarjetas de Resumen:**
  - Total Ingresos
  - Total Gastos
  - Balance (con indicador de superávit/déficit)

- **Gráficas:**
  - Gastos por categoría (Pie Chart)
  - Ingresos por categoría (Pie Chart)
  - Tendencia mensual de los últimos 6 meses (Line Chart)
  - Comparación Ingresos vs Gastos (Bar Chart)

- **Funcionalidades de Exportación:**
  - 📄 Descargar PDF Completo de estadísticas
  - 📊 Descargar CSV Completo de estadísticas
  - 💸 PDF de solo Gastos
  - 📈 CSV de solo Gastos
  - 💰 PDF de solo Ingresos
  - 📊 CSV de solo Ingresos

- **Últimas Transacciones:**
  - Listado de últimos 5 gastos
  - Listado de últimos 5 ingresos

### ✅ Dashboard de Administrador
- **Accesos Rápidos:**
  - Tarjetas con totales globales de Ingresos, Gastos, Usuarios y Pagos
  - Click en tarjeta redirige al módulo correspondiente

- **Estadísticas Globales:**
  - Total Ingresos del sistema
  - Total Gastos del sistema
  - Balance Global
  - Total Usuarios Activos

- **Gráficas Globales:**
  - Distribución global de ingresos por categoría
  - Distribución global de gastos por categoría
  - Comparativa global Ingresos vs Gastos vs Balance

- **Exportación:**
  - PDF de estadísticas globales
  - CSV de estadísticas globales

### ✅ Módulo de Ingresos (CRUD Completo)
- Crear ingreso (título, concepto, monto, categoría, fuente, fecha, notas)
- Listar todos los ingresos del usuario
- Editar ingreso
- Eliminar ingreso
- Búsqueda por título, concepto, categoría o fuente
- Visualización del total de ingresos
- Cálculo automático de ganancias (backend)

### ✅ Módulo de Gastos (CRUD Completo)
- Crear gasto (título, concepto, monto, categoría, fuente, fecha, notas)
- Listar todos los gastos del usuario
- Editar gasto
- Eliminar gasto
- Búsqueda por título, concepto, categoría o fuente
- Visualización del total de gastos
- Cálculo automático de ganancias (backend)

### ✅ Menú Lateral Dinámico
**Para Administrador:**
- 📊 Dashboard
- 💰 Ingresos
- 💸 Gastos
- 👥 Usuarios
- 💳 Pagos

**Para Usuario:**
- 📊 Mi Dashboard
- 💰 Mis Ingresos
- 💸 Mis Gastos

## 📂 Estructura del Frontend

```
savesmarthfrontend/
├── src/
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx        # Dashboard del admin
│   │   │   └── AdminDashboard.css
│   │   ├── user/
│   │   │   ├── UserDashboard.tsx         # Dashboard del usuario
│   │   │   └── UserDashboard.css
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── AuthPages.css
│   │   └── landing/
│   │       ├── LandingPage.tsx
│   │       └── LandingPage.css
│   │
│   ├── features/
│   │   ├── income/
│   │   │   ├── IncomePage.tsx            # CRUD de ingresos
│   │   │   └── IncomeForm.tsx
│   │   ├── expense/
│   │   │   ├── ExpensePage.tsx           # CRUD de gastos
│   │   │   └── ExpenseForm.tsx
│   │   └── students/                     # Template para otros módulos
│   │
│   ├── utils/
│   │   ├── helpers.ts                    # Utilidades generales
│   │   └── exportUtils.ts                # Exportación PDF y CSV
│   │
│   ├── services/
│   │   └── api.service.ts                # Todos los endpoints
│   │
│   └── layouts/
│       └── DashboardLayout.tsx           # Layout con menú dinámico
```

## 🔌 Endpoints Utilizados

### Autenticación
```
POST   /login                  - Iniciar sesión
POST   /login/register         - Registrar usuario
```

### Ingresos
```
GET    /incomes                - Obtener todos los ingresos
GET    /incomes/:id            - Obtener ingreso por ID
POST   /incomes                - Crear ingreso
PUT    /incomes/:id            - Actualizar ingreso
DELETE /incomes/:id            - Eliminar ingreso
```

### Gastos
```
GET    /expenses               - Obtener todos los gastos
GET    /expenses/:id           - Obtener gasto por ID
POST   /expenses               - Crear gasto
PUT    /expenses/:id           - Actualizar gasto
DELETE /expenses/:id           - Eliminar gasto
```

### Usuarios (Admin)
```
GET    /users                  - Obtener todos los usuarios
GET    /users/:id              - Obtener usuario por ID
POST   /users                  - Crear usuario
PUT    /users/:id              - Actualizar usuario (asignar rol)
DELETE /users/:id              - Eliminar usuario
```

### Pagos (Admin)
```
GET    /payments               - Obtener todos los pagos
POST   /payments               - Crear pago
PUT    /payments/:id           - Actualizar pago
DELETE /payments/:id           - Eliminar pago
PATCH  /payments/complete/:id  - Marcar pago como completado
```

## 🎨 Funcionalidades de Exportación

### Exportar a PDF
- **jsPDF**: Librería para generar PDFs
- **jspdf-autotable**: Plugin para tablas en PDF
- Incluye título, fecha, tablas formateadas y estilos personalizados

### Exportar a CSV
- **papaparse**: Librería para procesar CSV
- Formato compatible con Excel
- Escape automático de comas y comillas

### Tipos de Exportación Disponibles:

1. **Estadísticas Completas** (Usuario y Admin)
   - Resumen financiero (Ingresos, Gastos, Balance)
   - Ingresos por categoría
   - Gastos por categoría

2. **Solo Gastos**
   - Listado completo de gastos con todos los campos

3. **Solo Ingresos**
   - Listado completo de ingresos con todos los campos

## 🔐 Flujo de Autenticación y Roles

```
1. Usuario se registra → Se crea con rol "Usuario" por defecto
2. Usuario inicia sesión
3. Sistema verifica rol:
   - Si es "Administrador" → Redirige a /admin/dashboard
   - Si es "Usuario" → Redirige a /user/dashboard
4. El menú lateral cambia según el rol
5. Cada rol solo ve sus propios datos (Usuario) o todos (Admin)
```

### Asignación de Roles (Solo Admin)
- El administrador puede editar usuarios y cambiar su rol
- Roles disponibles: "Usuario" y "Administrador"
- Se eliminaron los roles "SuperUsuario" y "Psicólogo"

## 📊 Cálculos Automáticos

### En el Backend:
- **Profits (Ganancias)**: Se calculan automáticamente al crear/actualizar/eliminar ingresos o gastos
- Formula: `profits = totalIncome - totalExpense`
- Se actualiza en todos los registros de income y expense

### En el Frontend:
- **Total Ingresos**: Suma de todos los ingresos del usuario
- **Total Gastos**: Suma de todos los gastos del usuario
- **Balance**: Total Ingresos - Total Gastos
- **Agrupación por Categoría**: Los datos se agrupan dinámicamente para las gráficas
- **Tendencia Mensual**: Cálculo de los últimos 6 meses automático

## 🚀 Cómo Iniciar el Sistema

### 1. Backend
```bash
cd savesmarthapi
pnpm install
pnpm run start:dev
```
**URL**: http://localhost:3000

### 2. Frontend
```bash
cd savesmarthfrontend
pnpm install
pnpm run dev
```
**URL**: http://localhost:3001

### 3. MongoDB
Debe estar corriendo en: `mongodb://localhost:27017/savesmarth`

## 👥 Crear Usuarios de Prueba

### Usuario Regular:
1. Ir a http://localhost:3001/register
2. Completar formulario (rol "Usuario" se asigna automáticamente)
3. Login y acceder a `/user/dashboard`

### Usuario Administrador:
**Opción 1**: Crear desde MongoDB Compass
```javascript
// En la colección "logins"
{
  "username": "admin",
  "email": "admin@savesmarth.com",
  "password": "$2b$10$hashedpassword",  // Usar bcrypt para hashear
  "rol": "Administrador",
  "photo": ""
}
```

**Opción 2**: Crear usuario regular y luego cambiar su rol desde MongoDB:
```javascript
// Actualizar en la colección "logins"
db.logins.updateOne(
  { email: "usuario@email.com" },
  { $set: { rol: "Administrador" } }
)
```

## 📝 Próximas Funcionalidades (Pendientes)

### Módulos por Completar:
- ✅ Ingresos (Completado)
- ✅ Gastos (Completado)
- ⏳ Gestión de Usuarios (Admin) - Usar template de Students
- ⏳ Gestión de Pagos (Admin) - Usar template de Students
- ⏳ Perfil de Usuario
- ⏳ Configuración

### Funcionalidades Adicionales Sugeridas:
- Filtros por rango de fechas
- Metas de ahorro
- Presupuestos por categoría
- Recordatorios de pagos
- Notificaciones de gastos excesivos
- Comparativas año a año
- Exportar filtros personalizados

## 🛠️ Tecnologías Utilizadas

### Frontend:
- React 19.2.0
- TypeScript 5.9.3
- Redux Toolkit 2.10.1
- React Query 5.90.7
- React Router DOM 7.9.5
- Recharts 3.3.0
- jsPDF 3.0.3
- papaparse 5.5.3
- React Hot Toast 2.6.0
- Axios 1.13.2
- Yup 1.7.1
- React Hook Form 7.66.0
- Lodash 4.17.21
- date-fns 4.1.0

### Backend:
- NestJS 10.x
- MongoDB 8.6.1
- Mongoose 8.6.1
- TypeScript 5.1.3
- bcrypt 6.0.0

### Herramientas:
- pnpm (gestor de paquetes)
- Vite (build tool)

## 📄 Documentación Adicional

- `API_SAVESMARTH_RESUMEN.md` - Documentación completa del backend
- `INICIO_RAPIDO.md` - Guía rápida de inicio
- `savesmarthfrontend/README.md` - Documentación del frontend

## 🎉 ¡El Sistema Está Listo!

El sistema de gestión de gastos SaveSmarth está completamente funcional con:

✅ Autenticación con roles
✅ Dashboard de Usuario con gráficas personales
✅ Dashboard de Admin con vista global
✅ CRUD de Ingresos
✅ CRUD de Gastos
✅ Exportación PDF y CSV
✅ Menú dinámico según rol
✅ Cálculos automáticos de balance
✅ Responsive design
✅ Notificaciones toast
✅ Validación de formularios
✅ Manejo de errores

---

**Desarrollado con ❤️ para la gestión inteligente de tus finanzas**

**Frontend**: http://localhost:3001
**Backend**: http://localhost:3000
**MongoDB**: mongodb://localhost:27017/savesmarth
