# SaveSmarth API - Resumen Completo

## 📋 Descripción General

**SaveSmarth API** es un sistema integral de gestión para un centro de tratamiento/rehabilitación que maneja pacientes, personal, operaciones financieras, pagos y reportes médicos.

- **Framework:** NestJS 10.x
- **Base de Datos:** MongoDB 8.6.1
- **ODM:** Mongoose 8.6.1
- **Lenguaje:** TypeScript 5.1.3
- **Gestor de Paquetes:** pnpm
- **Puerto:** 3000
- **Base URL:** `http://localhost:3000/savesmarth/api/v1/`

---

## 🏗️ Arquitectura y Módulos

El sistema está compuesto por **7 módulos principales**:

### 1. **Students (Estudiantes/Pacientes)**
Gestión completa de pacientes con información médica, historial de tratamiento y archivos adjuntos.

### 2. **Users (Usuarios/Personal)**
Administración de personal médico y empleados con control de acceso basado en roles.

### 3. **Login/Authentication (Autenticación)**
Sistema de autenticación con registro, login y gestión de perfiles.

### 4. **Payments (Pagos)**
Sistema de pagos con soporte para pagos programados y recurrentes.

### 5. **Reports (Reportes)**
Generación y gestión de reportes médicos asociados a estudiantes.

### 6. **Income (Ingresos)**
Registro de ingresos con cálculo automático de ganancias.

### 7. **Expense (Gastos)**
Registro de gastos con recalculación automática de ganancias.

---

## 📊 Modelos de Datos (Schemas)

### **Students (Estudiantes)**
```typescript
{
  number: string,              // Número de identificación
  name: string,                // Nombre
  lastname: string,            // Apellido
  username: string      // Usuario
  gender: string, ,                   // Género
  blood: string,               // Tipo de sangre
  age: string,                 // Edad
  curp: string,                // CURP (ID mexicano)
  email: string,               // Email
  password: string,            // Contraseña
  phone: string,               // Teléfono
  address: string,             // Dirección
  disease: string,             // Enfermedad
  allergy: string,             // Alergias
  drug: string,                // Medicamentos
  stigma: string,              // Estigma
  treatment: string,           // Tratamiento
  tutor: string,               // Tutor/Guardian
  stay: string,                // Estancia
  file: string,                // Archivo principal
  files: [                     // Archivos adicionales
    {
      file: string,
      title: string,
      date: string
    }
  ],
  description: string,         // Descripción
  startdate: Date,             // Fecha de inicio
  enddate: string,             // Fecha de fin
  service: string,             // Servicio
  experience: string,          // Experiencia
  psychology: string,          // Psicología
  sessions: string,            // Sesiones
  check: number,               // Verificación
  medicine: string,            // Medicina
  status: 'Baja' | 'En Tratamiento' | 'Egresado',
  payments: ObjectId[],        // Referencias a pagos
  softdelete: boolean,         // Eliminación lógica
  createdAt: Date,            // Fecha de creación
  updatedAt: Date             // Fecha de actualización
}
```

### **Users (Usuarios)**
```typescript
{
  number: string,
  name: string,
  lastname: string,
  username: string,
  gender: string,
  blood: string,
  age: string,
  curp: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  disease: string,
  allergy: string,
  drug: string,
  stigma: string,
  treatment: string,
  tutor: string,
  stay: string,
  file: string,
  files: [
    {
      file: string,
      title: string,
      date: string
    }
  ],
  description: string,
  startdate: string,
  enddate: string,
  status: 'Baja' | 'Activo' | 'Egresado',
  rol: 'Usuario' | 'SuperUsuario' | 'Administrador' | 'Psicólogo',
  reports: [
    {
      report: string,
      autor: string,
      date: string
    }
  ]
}
```

### **Login (Autenticación)**
```typescript
{
  photo: string,               // Foto de perfil
  username: string,            // Usuario único
  email: string,               // Email único
  password: string,            // Contraseña (bcrypt)
  rol: string,                 // Rol del usuario
  update: Date                 // Última actualización
}
```

### **Payment (Pagos)**
```typescript
{
  concept: string,             // Concepto del pago
  amount: number,              // Monto
  method: string,              // Método de pago
  status: 'pending' | 'completed' | 'cancelled',
  student: string,             // ID del estudiante
  deletedAt: Date | null,      // Eliminación lógica
  isScheduled: boolean,        // Si es pago programado
  frequency: 'daily' | 'weekly' | 'friday' | 'saturday',
  dueDate: Date,               // Fecha de vencimiento
  startDate: Date,             // Fecha de inicio
  createdAt: Date,            // Auto-generado
  updatedAt: Date             // Auto-generado
}
```

### **Reports (Reportes)**
```typescript
{
  idstudent: ObjectId,         // Referencia al estudiante (requerido)
  author: string,              // Autor del reporte
  title: string,               // Título
  reports: string,             // Contenido del reporte
  date: string,                // Fecha
  // + Todos los campos del estudiante (desnormalización)
}
```

### **Income (Ingresos)**
```typescript
{
  iduser: ObjectId,            // Referencia al usuario
  title: string,               // Título
  concept: string,             // Concepto
  amount: number,              // Monto
  source: string,              // Fuente
  category: string,            // Categoría
  date: Date,                  // Fecha
  notes: string,               // Notas
  deletedAt: Date,             // Eliminación lógica
  profits: number              // Ganancias (auto-calculado)
}
```

### **Expense (Gastos)**
```typescript
{
  iduser: ObjectId,            // Referencia al usuario
  title: string,               // Título
  concept: string,             // Concepto
  amount: number,              // Monto
  source: string,              // Fuente
  category: string,            // Categoría
  date: Date,                  // Fecha
  notes: string,               // Notas
  deletedAt: Date,             // Eliminación lógica
  profits: number              // Ganancias (auto-calculado)
}
```

---

## 🔌 Endpoints de la API

### **Students** (`/students`)
```
POST    /students                    - Crear estudiante
GET     /students                    - Obtener todos (activos)
GET     /students/:id                - Obtener por ID
GET     /students/findByEmail/:email - Buscar por email
PUT     /students/:id                - Actualizar
DELETE  /students/:id                - Eliminar permanentemente
PATCH   /students/soft/:id           - Eliminación lógica
PATCH   /students/restore/:id        - Restaurar eliminado
```

### **Users** (`/users`)
```
POST    /users       - Crear usuario
GET     /users       - Obtener todos
GET     /users/:id   - Obtener por ID
PUT     /users/:id   - Actualizar
DELETE  /users/:id   - Eliminar
```

### **Login/Auth** (`/login`)
```
POST    /login                  - Iniciar sesión
POST    /login/register         - Registrar usuario
GET     /login                  - Obtener todas las cuentas
GET     /login/find/:id_user    - Obtener por ID
PUT     /login/update/:id       - Actualizar perfil
DELETE  /login/delete/:id_user  - Eliminar cuenta
```

### **Payments** (`/payments`)
```
POST    /payments                      - Crear pago
GET     /payments                      - Obtener todos (activos)
GET     /payments/:id                  - Obtener por ID
PUT     /payments/:id                  - Actualizar
DELETE  /payments/:id                  - Eliminación lógica
PATCH   /payments/restore/:id          - Restaurar pago
PATCH   /payments/complete/:id         - Marcar como completado

POST    /payments/scheduled            - Crear pago programado
GET     /payments/scheduled            - Obtener pagos programados
DELETE  /payments/scheduled/:id        - Eliminar programado
PATCH   /payments/scheduled/complete/:id - Completar programado
```

### **Reports** (`/reports`)
```
POST    /reports/:studentId         - Crear reporte
GET     /reports                    - Obtener todos
GET     /reports/:reportId          - Obtener por ID
GET     /reports/students/:studentId - Obtener por estudiante
PUT     /reports/:reportId          - Actualizar
DELETE  /reports/:reportId          - Eliminar
```

### **Income** (`/incomes`)
```
POST    /incomes     - Crear ingreso
GET     /incomes     - Obtener todos (activos)
GET     /incomes/:id - Obtener por ID
PUT     /incomes/:id - Actualizar
DELETE  /incomes/:id - Eliminación lógica (recalcula ganancias)
```

### **Expense** (`/expenses`)
```
POST    /expenses     - Crear gasto
GET     /expenses     - Obtener todos (activos)
GET     /expenses/:id - Obtener por ID
PUT     /expenses/:id - Actualizar
DELETE  /expenses/:id - Eliminación lógica (recalcula ganancias)
```

---

## 🔐 Autenticación y Autorización

### **Método de Autenticación**
- Hash de contraseñas con **bcrypt** (10 salt rounds)
- Endpoint de login valida email + contraseña
- Retorna objeto de usuario en autenticación exitosa

### **Roles de Usuario**
- **Usuario** - Usuario básico
- **SuperUsuario** - Super usuario con permisos elevados
- **Administrador** - Administrador del sistema
- **Psicólogo** - Personal de psicología

---

## 🔗 Relaciones entre Entidades

```
Students (1) -----> (N) Payments
  └─ Students.payments: ObjectId[]

Students (1) -----> (N) Reports
  └─ Reports.idstudent: ObjectId

Users (1) -----> (N) Income
  └─ Income.iduser: ObjectId

Users (1) -----> (N) Expense
  └─ Expense.iduser: ObjectId
```

---

## ⚙️ Configuraciones Especiales

### **CORS**
```typescript
Origin: http://localhost:3001
Methods: GET, HEAD, PUT, PATCH, POST, DELETE
Credentials: true
```

### **Límites de Peticiones**
```typescript
JSON: 50mb
URL-encoded: 50mb
```

### **Eliminación Lógica (Soft Delete)**
- **Students:** campo `softdelete` (boolean)
- **Payments, Income, Expense:** campo `deletedAt` (Date)
- Los registros eliminados se excluyen de las consultas
- Se pueden restaurar usando endpoints `/restore`

### **Cálculo Automático de Ganancias**
```typescript
profits = totalIncome - totalExpense
```
- Se recalcula automáticamente al crear/actualizar/eliminar ingresos o gastos
- Se actualiza en todos los registros de income y expense

### **Pagos Programados**
- Soporte para frecuencias: diaria, semanal, viernes, sábado
- Flag `isScheduled` para diferenciar pagos regulares vs programados
- Endpoints separados para gestionar pagos programados

### **Gestión de Archivos**
- Soporte para múltiples archivos por estudiante
- Estructura: `{ file: string, title: string, date: string }`
- Almacenamiento en base64 o ruta de archivo

---

## 🗄️ Base de Datos

### **Configuración**
```
MongoDB URI: mongodb://localhost:27017/savesmarth
```

### **Colecciones**
- `students` - Estudiantes/Pacientes
- `users` - Usuarios/Personal
- `logins` - Cuentas de autenticación
- `payments` - Pagos
- `reports` - Reportes médicos
- `incomes` - Ingresos
- `expenses` - Gastos

---

## 📦 Stack Tecnológico

| Tecnología | Versión |
|-----------|---------|
| NestJS | 10.x |
| Node.js | Latest |
| MongoDB | 8.6.1 |
| Mongoose | 8.6.1 |
| bcrypt | 6.0.0 |
| class-validator | 0.14.1 |
| class-transformer | 0.5.1 |
| TypeScript | 5.1.3 |
| Jest | 29.5.0 |
| pnpm | Latest |

---

## 🎯 Características Principales

### ✅ Funcionalidades Implementadas
- ✓ CRUD completo para todas las entidades
- ✓ Sistema de autenticación con bcrypt
- ✓ Control de acceso basado en roles (RBAC)
- ✓ Eliminación lógica (soft delete) con restauración
- ✓ Pagos programados y recurrentes
- ✓ Cálculo automático de ganancias
- ✓ Gestión de archivos múltiples
- ✓ Validación de datos con class-validator
- ✓ Manejo de errores personalizado
- ✓ Relaciones entre entidades con ObjectId
- ✓ Timestamps automáticos

### 📌 Validaciones
- IDs de MongoDB válidos (ObjectId)
- Email único en login
- Username único en login
- Validación de DTOs en todas las peticiones POST/PUT
- ValidationPipe global

---

## 📁 Estructura de Archivos Clave

```
savesmarthapi/
├── src/
│   ├── main.ts                    # Punto de entrada
│   ├── app.module.ts              # Módulo principal
│   ├── students/                  # Módulo de estudiantes
│   │   ├── schema/
│   │   │   └── students.schema.ts
│   │   ├── dto/
│   │   ├── students.controller.ts
│   │   └── students.service.ts
│   ├── users/                     # Módulo de usuarios
│   │   ├── schema/
│   │   │   └── users.schema.ts
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── login/                     # Módulo de autenticación
│   │   ├── schema/
│   │   │   └── login.schema.ts
│   │   ├── dto/
│   │   ├── login.controller.ts
│   │   └── login.service.ts
│   ├── payment/                   # Módulo de pagos
│   │   ├── schema/
│   │   │   └── payment.schema.ts
│   │   ├── dto/
│   │   ├── payment.controller.ts
│   │   └── payment.service.ts
│   ├── reports/                   # Módulo de reportes
│   │   ├── schema/
│   │   │   └── reports.schema.ts
│   │   ├── dto/
│   │   ├── reports.controller.ts
│   │   └── reports.service.ts
│   ├── income/                    # Módulo de ingresos
│   │   ├── schema/
│   │   │   └── income.schema.ts
│   │   ├── dto/
│   │   ├── income.controller.ts
│   │   └── income.service.ts
│   └── expense/                   # Módulo de gastos
│       ├── schema/
│       │   └── expenses.schema.ts
│       ├── dto/
│       ├── expense.controller.ts
│       └── expense.service.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── nest-cli.json
```

---

## 🚀 Instrucciones de Uso

### Instalación
```bash
cd savesmarthapi
pnpm install
```

### Desarrollo
```bash
pnpm run start:dev
```

### Producción
```bash
pnpm run build
pnpm run start:prod
```

### Testing
```bash
pnpm run test
```

---

## 📝 Notas Importantes

1. **Puerto del Frontend:** El CORS está configurado para `http://localhost:3001`
2. **Tamaño de Archivos:** Soporta hasta 50mb para JSON y archivos
3. **Base de Datos:** Debe estar MongoDB corriendo en `localhost:27017`
4. **Autenticación:** No implementa JWT - se espera que el frontend maneje el estado
5. **Timestamps:** Se generan automáticamente en la mayoría de las entidades
6. **Soft Delete:** Los registros eliminados NO aparecen en consultas GET normales
7. **Gestor de Paquetes:** Se usa **pnpm** en lugar de npm

---

## 🔄 Flujos de Trabajo Comunes

### 1. Registrar y Autenticar Usuario
```
1. POST /login/register { username, email, password, rol }
2. POST /login { email, password }
3. Guardar datos del usuario en el frontend
```

### 2. Crear Estudiante y Asignar Pago
```
1. POST /students { ...datos }
2. POST /payments { student: studentId, ...datos }
3. El pago se asocia automáticamente al estudiante
```

### 3. Generar Reporte de Estudiante
```
1. GET /students/:id (obtener datos del estudiante)
2. POST /reports/:studentId { author, title, reports, date }
3. GET /reports/students/:studentId (ver todos los reportes)
```

### 4. Registrar Ingreso y Revisar Ganancias
```
1. POST /incomes { iduser, title, concept, amount, ... }
2. Sistema calcula automáticamente profits
3. GET /incomes (ver todos con ganancias actualizadas)
```

---

**Fecha de Documentación:** 2025-11-08
**Versión del API:** 1.0
**Base URL:** `http://localhost:3000/savesmarth/api/v1/`
