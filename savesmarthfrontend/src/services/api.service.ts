/**
 * Archivo principal de servicios API
 * Contiene todas las funciones para comunicarse con el backend
 * Organizado por módulos/entidades para facilitar su uso y mantenimiento
 */

import axiosInstance from '../config/axios.config';
import type {
  Student,
  User,
  Login,
  Payment,
  Report,
  Income,
  Expense,
  LoginRequest,
  RegisterRequest,
  Video,
  Article,
  NewsResponse,
} from '../types';

// ==================== AUTH API ====================
/**
 * Servicios de autenticación y gestión de cuentas de usuario
 * Maneja el login, registro, perfiles y administración de cuentas
 */
export const authApi = {
  /**
   * Iniciar sesión con credenciales de usuario
   * @param credentials - Email y contraseña del usuario
   * @returns Datos del usuario autenticado o false si falla
   */
  login: async (credentials: LoginRequest) => {
    const response = await axiosInstance.post<Login | false>('/login', credentials);
    return response.data;
  },

  /**
   * Registrar una nueva cuenta de usuario
   * @param data - Información del nuevo usuario (nombre, email, contraseña, etc.)
   * @returns Datos del usuario recién registrado
   */
  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post<Login>('/login/register', data);
    return response.data;
  },

  /**
   * Obtener el perfil completo de un usuario específico
   * @param userId - ID del usuario a consultar
   * @returns Información completa del perfil del usuario
   */
  getProfile: async (userId: string) => {
    const response = await axiosInstance.get<Login>(`/login/find/${userId}`);
    return response.data;
  },

  /**
   * Actualizar información del perfil de usuario
   * @param userId - ID del usuario a actualizar
   * @param data - Campos a actualizar (parcial)
   * @returns Perfil actualizado
   */
  updateProfile: async (userId: string, data: Partial<Login>) => {
    const response = await axiosInstance.put<Login>(`/login/update/${userId}`, data);
    return response.data;
  },

  /**
   * Eliminar permanentemente una cuenta de usuario
   * @param userId - ID del usuario a eliminar
   * @returns Confirmación de eliminación
   */
  deleteAccount: async (userId: string) => {
    const response = await axiosInstance.delete(`/login/delete/${userId}`);
    return response.data;
  },

  /**
   * Obtener lista de todas las cuentas registradas
   * Útil para administradores del sistema
   * @returns Array con todas las cuentas
   */
  getAllAccounts: async () => {
    const response = await axiosInstance.get<Login[]>('/login');
    return response.data;
  },
};

// ==================== STUDENTS API ====================
/**
 * Servicios para gestión de estudiantes
 * CRUD completo con opciones de eliminación suave y restauración
 */
export const studentsApi = {
  /**
   * Obtener lista completa de estudiantes
   * @returns Array con todos los estudiantes
   */
  getAll: async () => {
    const response = await axiosInstance.get<Student[]>('/students');
    return response.data;
  },

  /**
   * Buscar estudiante por ID
   * @param id - ID del estudiante
   * @returns Datos del estudiante
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Student>(`/students/${id}`);
    return response.data;
  },

  /**
   * Buscar estudiante por correo electrónico
   * @param email - Email del estudiante
   * @returns Datos del estudiante
   */
  getByEmail: async (email: string) => {
    const response = await axiosInstance.get<Student>(`/students/findByEmail/${email}`);
    return response.data;
  },

  /**
   * Crear nuevo estudiante
   * @param data - Información del estudiante
   * @returns Estudiante creado
   */
  create: async (data: Partial<Student>) => {
    const response = await axiosInstance.post<Student>('/students', data);
    return response.data;
  },

  /**
   * Actualizar información de estudiante
   * @param id - ID del estudiante
   * @param data - Campos a actualizar
   * @returns Estudiante actualizado
   */
  update: async (id: string, data: Partial<Student>) => {
    const response = await axiosInstance.put<Student>(`/students/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar estudiante permanentemente
   * @param id - ID del estudiante
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/students/${id}`);
    return response.data;
  },

  /**
   * Eliminación suave (marca como eliminado sin borrar de BD)
   * @param id - ID del estudiante
   * @returns Confirmación de eliminación suave
   */
  softDelete: async (id: string) => {
    const response = await axiosInstance.patch(`/students/soft/${id}`);
    return response.data;
  },

  /**
   * Restaurar estudiante eliminado suavemente
   * @param id - ID del estudiante
   * @returns Estudiante restaurado
   */
  restore: async (id: string) => {
    const response = await axiosInstance.patch<Student>(`/students/restore/${id}`);
    return response.data;
  },
};

// ==================== USERS API ====================
/**
 * Servicios para gestión de usuarios del sistema
 * CRUD básico para usuarios administrativos o staff
 */
export const usersApi = {
  /**
   * Obtener todos los usuarios del sistema
   * @returns Lista de usuarios
   */
  getAll: async () => {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  /**
   * Buscar usuario por ID
   * @param id - ID del usuario
   * @returns Datos del usuario
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo usuario
   * @param data - Información del usuario
   * @returns Usuario creado
   */
  create: async (data: Partial<User>) => {
    const response = await axiosInstance.post<User>('/users', data);
    return response.data;
  },

  /**
   * Actualizar información de usuario
   * @param id - ID del usuario
   * @param data - Campos a actualizar
   * @returns Usuario actualizado
   */
  update: async (id: string, data: Partial<User>) => {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar usuario del sistema
   * @param id - ID del usuario
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};

// ==================== PAYMENTS API ====================
/**
 * Servicios para gestión de pagos
 * Incluye pagos regulares y programados
 */
export const paymentsApi = {
  /**
   * Obtener todos los pagos registrados
   * @returns Lista de pagos
   */
  getAll: async () => {
    const response = await axiosInstance.get<Payment[]>('/payments');
    return response.data;
  },

  /**
   * Buscar pago por ID
   * @param id - ID del pago
   * @returns Datos del pago
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  /**
   * Obtener pagos de un usuario específico
   * @param userId - ID del usuario
   * @returns Lista de pagos del usuario
   */
  getByUser: async (userId: string) => {
    const response = await axiosInstance.get<Payment[]>(`/payments/user/${userId}`);
    return response.data;
  },

  /**
   * Registrar nuevo pago
   * @param data - Información del pago
   * @returns Pago creado
   */
  create: async (data: Partial<Payment>) => {
    const response = await axiosInstance.post<Payment>('/payments', data);
    return response.data;
  },

  /**
   * Actualizar información de pago
   * @param id - ID del pago
   * @param data - Campos a actualizar
   * @returns Pago actualizado
   */
  update: async (id: string, data: Partial<Payment>) => {
    const response = await axiosInstance.put<Payment>(`/payments/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar pago del sistema
   * @param id - ID del pago
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/payments/${id}`);
    return response.data;
  },

  /**
   * Restaurar pago eliminado
   * @param id - ID del pago
   * @returns Pago restaurado
   */
  restore: async (id: string) => {
    const response = await axiosInstance.patch<Payment>(`/payments/restore/${id}`);
    return response.data;
  },

  /**
   * Marcar pago como completado
   * @param id - ID del pago
   * @returns Pago completado
   */
  complete: async (id: string) => {
    const response = await axiosInstance.patch<Payment>(`/payments/complete/${id}`);
    return response.data;
  },

  // === Pagos Programados ===
  
  /**
   * Crear pago programado para fecha futura
   * @param data - Información del pago programado
   * @returns Pago programado creado
   */
  createScheduled: async (data: Partial<Payment>) => {
    const response = await axiosInstance.post<Payment>('/payments/scheduled', data);
    return response.data;
  },

  /**
   * Obtener todos los pagos programados
   * @returns Lista de pagos programados
   */
  getAllScheduled: async () => {
    const response = await axiosInstance.get<Payment[]>('/payments/scheduled');
    return response.data;
  },

  /**
   * Eliminar pago programado
   * @param id - ID del pago programado
   * @returns Confirmación de eliminación
   */
  deleteScheduled: async (id: string) => {
    const response = await axiosInstance.delete(`/payments/scheduled/${id}`);
    return response.data;
  },

  /**
   * Completar pago programado (ejecutar pago)
   * @param id - ID del pago programado
   * @returns Pago ejecutado
   */
  completeScheduled: async (id: string) => {
    const response = await axiosInstance.patch<Payment>(`/payments/scheduled/complete/${id}`);
    return response.data;
  },
};

// ==================== REPORTS API ====================
/**
 * Servicios para gestión de reportes/informes de estudiantes
 * Permite crear y gestionar reportes de progreso
 */
export const reportsApi = {
  /**
   * Obtener todos los reportes
   * @returns Lista de reportes
   */
  getAll: async () => {
    const response = await axiosInstance.get<Report[]>('/reports');
    return response.data;
  },

  /**
   * Buscar reporte por ID
   * @param id - ID del reporte
   * @returns Datos del reporte
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Report>(`/reports/${id}`);
    return response.data;
  },

  /**
   * Obtener reportes de un estudiante específico
   * @param studentId - ID del estudiante
   * @returns Lista de reportes del estudiante
   */
  getByStudent: async (studentId: string) => {
    const response = await axiosInstance.get<Report[]>(`/reports/students/${studentId}`);
    return response.data;
  },

  /**
   * Crear nuevo reporte para estudiante
   * @param studentId - ID del estudiante
   * @param data - Información del reporte
   * @returns Reporte creado
   */
  create: async (studentId: string, data: Partial<Report>) => {
    const response = await axiosInstance.post<Report>(`/reports/${studentId}`, data);
    return response.data;
  },

  /**
   * Actualizar reporte existente
   * @param id - ID del reporte
   * @param data - Campos a actualizar
   * @returns Reporte actualizado
   */
  update: async (id: string, data: Partial<Report>) => {
    const response = await axiosInstance.put<Report>(`/reports/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar reporte
   * @param id - ID del reporte
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/reports/${id}`);
    return response.data;
  },
};

// ==================== INCOME API ====================
/**
 * Servicios para gestión de ingresos
 * Control financiero de entradas de dinero
 */
export const incomeApi = {
  /**
   * Obtener todos los ingresos registrados
   * @returns Lista de ingresos
   */
  getAll: async () => {
    const response = await axiosInstance.get<Income[]>('/incomes');
    return response.data;
  },

  /**
   * Buscar ingreso por ID
   * @param id - ID del ingreso
   * @returns Datos del ingreso
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Income>(`/incomes/${id}`);
    return response.data;
  },

  /**
   * Registrar nuevo ingreso
   * @param data - Información del ingreso
   * @returns Ingreso creado
   */
  create: async (data: Partial<Income>) => {
    const response = await axiosInstance.post<Income>('/incomes', data);
    return response.data;
  },

  /**
   * Actualizar información de ingreso
   * @param id - ID del ingreso
   * @param data - Campos a actualizar
   * @returns Ingreso actualizado
   */
  update: async (id: string, data: Partial<Income>) => {
    const response = await axiosInstance.put<Income>(`/incomes/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar registro de ingreso
   * @param id - ID del ingreso
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/incomes/${id}`);
    return response.data;
  },
};

// ==================== EXPENSE API ====================
/**
 * Servicios para gestión de gastos
 * Control financiero de salidas de dinero
 */
export const expenseApi = {
  /**
   * Obtener todos los gastos registrados
   * @returns Lista de gastos
   */
  getAll: async () => {
    const response = await axiosInstance.get<Expense[]>('/expenses');
    return response.data;
  },

  /**
   * Buscar gasto por ID
   * @param id - ID del gasto
   * @returns Datos del gasto
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Registrar nuevo gasto
   * @param data - Información del gasto
   * @returns Gasto creado
   */
  create: async (data: Partial<Expense>) => {
    const response = await axiosInstance.post<Expense>('/expenses', data);
    return response.data;
  },

  /**
   * Actualizar información de gasto
   * @param id - ID del gasto
   * @param data - Campos a actualizar
   * @returns Gasto actualizado
   */
  update: async (id: string, data: Partial<Expense>) => {
    const response = await axiosInstance.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar registro de gasto
   * @param id - ID del gasto
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    return response.data;
  },
};

// ==================== VIDEOS API ====================
/**
 * Servicios para gestión de contenido de video
 * Manejo de videos educativos con categorías y destacados
 */
export const videosApi = {
  /**
   * Obtener todos los videos (incluye no publicados)
   * @returns Lista completa de videos
   */
  getAll: async () => {
    const response = await axiosInstance.get<Video[]>('/video');
    return response.data;
  },

  /**
   * Obtener solo videos publicados
   * @returns Lista de videos públicos
   */
  getPublished: async () => {
    const response = await axiosInstance.get<Video[]>('/video/published');
    return response.data;
  },

  /**
   * Filtrar videos por categoría
   * @param category - Categoría a filtrar
   * @returns Videos de la categoría
   */
  getByCategory: async (category: string) => {
    const response = await axiosInstance.get<Video[]>(`/video/category/${category}`);
    return response.data;
  },

  /**
   * Obtener videos destacados/featured
   * @returns Videos marcados como destacados
   */
  getFeatured: async () => {
    const response = await axiosInstance.get<Video[]>('/video/featured');
    return response.data;
  },

  /**
   * Buscar video por ID
   * @param id - ID del video
   * @returns Datos del video
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Video>(`/video/${id}`);
    return response.data;
  },

  /**
   * Incrementar contador de vistas del video
   * @param id - ID del video
   * @returns Video con vistas actualizadas
   */
  incrementViews: async (id: string) => {
    const response = await axiosInstance.patch<Video>(`/video/${id}/view`);
    return response.data;
  },

  /**
   * Crear nuevo video
   * @param data - Información del video
   * @returns Video creado
   */
  create: async (data: Partial<Video>) => {
    const response = await axiosInstance.post<Video>('/video', data);
    return response.data;
  },

  /**
   * Actualizar información de video
   * @param id - ID del video
   * @param data - Campos a actualizar
   * @returns Video actualizado
   */
  update: async (id: string, data: Partial<Video>) => {
    const response = await axiosInstance.put<Video>(`/video/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar video (soft delete)
   * @param id - ID del video
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete<Video>(`/video/${id}`);
    return response.data;
  },

  /**
   * Restaurar video eliminado
   * @param id - ID del video
   * @returns Video restaurado
   */
  restore: async (id: string) => {
    const response = await axiosInstance.patch<Video>(`/video/${id}/restore`);
    return response.data;
  },
};

// ==================== ARTICLES API ====================
/**
 * Servicios para gestión de artículos/blog
 * Sistema de contenido con slugs, categorías y tipos
 */
export const articlesApi = {
  /**
   * Obtener todos los artículos (incluye borradores)
   * @returns Lista completa de artículos
   */
  getAll: async () => {
    const response = await axiosInstance.get<Article[]>('/article');
    return response.data;
  },

  /**
   * Obtener solo artículos publicados
   * @returns Lista de artículos públicos
   */
  getPublished: async () => {
    const response = await axiosInstance.get<Article[]>('/article/published');
    return response.data;
  },

  /**
   * Filtrar artículos por tipo
   * @param type - Tipo de artículo
   * @returns Artículos del tipo especificado
   */
  getByType: async (type: string) => {
    const response = await axiosInstance.get<Article[]>(`/article/type/${type}`);
    return response.data;
  },

  /**
   * Filtrar artículos por categoría
   * @param category - Categoría a filtrar
   * @returns Artículos de la categoría
   */
  getByCategory: async (category: string) => {
    const response = await axiosInstance.get<Article[]>(`/article/category/${category}`);
    return response.data;
  },

  /**
   * Obtener artículos destacados
   * @returns Artículos marcados como destacados
   */
  getFeatured: async () => {
    const response = await axiosInstance.get<Article[]>('/article/featured');
    return response.data;
  },

  /**
   * Buscar artículo por slug (URL amigable)
   * @param slug - Slug del artículo
   * @returns Datos del artículo
   */
  getBySlug: async (slug: string) => {
    const response = await axiosInstance.get<Article>(`/article/slug/${slug}`);
    return response.data;
  },

  /**
   * Buscar artículo por ID
   * @param id - ID del artículo
   * @returns Datos del artículo
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Article>(`/article/${id}`);
    return response.data;
  },

  /**
   * Incrementar contador de vistas del artículo
   * @param id - ID del artículo
   * @returns Artículo con vistas actualizadas
   */
  incrementViews: async (id: string) => {
    const response = await axiosInstance.patch<Article>(`/article/${id}/view`);
    return response.data;
  },

  /**
   * Crear nuevo artículo
   * @param data - Información del artículo
   * @returns Artículo creado
   */
  create: async (data: Partial<Article>) => {
    const response = await axiosInstance.post<Article>('/article', data);
    return response.data;
  },

  /**
   * Actualizar información del artículo
   * @param id - ID del artículo
   * @param data - Campos a actualizar
   * @returns Artículo actualizado
   */
  update: async (id: string, data: Partial<Article>) => {
    const response = await axiosInstance.put<Article>(`/article/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar artículo (soft delete)
   * @param id - ID del artículo
   * @returns Confirmación de eliminación
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete<Article>(`/article/${id}`);
    return response.data;
  },

  /**
   * Restaurar artículo eliminado
   * @param id - ID del artículo
   * @returns Artículo restaurado
   */
  restore: async (id: string) => {
    const response = await axiosInstance.patch<Article>(`/article/${id}/restore`);
    return response.data;
  },
};

// ==================== NEWS API ====================
/**
 * Servicios para obtener noticias financieras desde NewsAPI
 */
export const newsApi = {
  /**
   * Obtener noticias financieras
   */
  getFinancialNews: async (page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<NewsResponse>(`/news/financial?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  /**
   * Obtener noticias de negocios
   */
  getBusinessNews: async (country = 'mx', pageSize = 10) => {
    const response = await axiosInstance.get<NewsResponse>(`/news/business?country=${country}&pageSize=${pageSize}`);
    return response.data;
  },

  /**
   * Buscar noticias por query
   */
  searchNews: async (query: string, page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<NewsResponse>(`/news/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
    return response.data;
  },
};

/**
 * Exportación principal que agrupa todos los servicios API
 * Facilita la importación y uso en los componentes
 * 
 * Ejemplo de uso:
 * import api from './services/api';
 * 
 * // Para autenticación
 * await api.auth.login(credentials);
 * 
 * // Para estudiantes
 * await api.students.getAll();
 * 
 * // Para pagos
 * await api.payments.create(paymentData);
 */
export default {
  auth: authApi,
  students: studentsApi,
  users: usersApi,
  payments: paymentsApi,
  reports: reportsApi,
  income: incomeApi,
  expense: expenseApi,
  videos: videosApi,
  articles: articlesApi,
  news: newsApi,
};