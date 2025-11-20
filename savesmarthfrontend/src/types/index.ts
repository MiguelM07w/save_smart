// ==================== ENUMS ====================

export enum StudentStatus {
  BAJA = 'Baja',
  EN_TRATAMIENTO = 'En Tratamiento',
  EGRESADO = 'Egresado',
}

export enum UserStatus {
  BAJA = 'Baja',
  ACTIVO = 'Activo',
  EGRESADO = 'Egresado',
}

export enum UserRol {
  USUARIO = 'Usuario',
  ADMINISTRADOR = 'Administrador',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

// ==================== INTERFACES ====================

export interface FileObject {
  file: string;
  title: string;
  date: string;
}

export interface ReportObject {
  report: string;
  autor: string;
  date: string;
}

// Student Interface
export interface Student {
  _id?: string;
  number: string;
  name: string;
  lastname: string;
  username: string;
  gender: string;
  blood: string;
  age: string;
  curp: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  disease: string;
  allergy: string;
  drug: string;
  stigma: string;
  treatment: string;
  tutor: string;
  stay: string;
  file: string;
  files: FileObject[];
  description: string;
  startdate: Date | string;
  enddate: string;
  service: string;
  experience: string;
  psychology: string;
  sessions: string;
  check: number;
  medicine: string;
  status: StudentStatus;
  payments: string[];
  softdelete: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// User Interface
export interface User {
  _id?: string;
  number: string;
  name: string;
  lastname: string;
  username: string;
  gender: string;
  blood: string;
  age: string;
  curp: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  disease: string;
  allergy: string;
  drug: string;
  stigma: string;
  treatment: string;
  tutor: string;
  stay: string;
  file: string;
  files: FileObject[];
  description: string;
  startdate: string;
  enddate: string;
  status: UserStatus;
  rol: UserRol;
  reports: ReportObject[];
}

// Login Interface
export interface Login {
  _id?: string;
  photo: string;
  username: string;
  email: string;
  password: string;
  rol: string;
  token?: string; // JWT token for authentication
  update?: Date | string;
}

// Payment Interface
export interface Payment {
  _id?: string;
  concept: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  userId: string; // Relacionado con Users en vez de student
  deletedAt?: Date | string | null;
  isScheduled: boolean;
  frequency?: PaymentFrequency;
  dueDate?: Date | string;
  startDate?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Notification Interface
export enum NotificationType {
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_CANCELLED = 'payment_cancelled',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
  relatedId?: string; // ID del pago relacionado
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

// Report Interface
export interface Report {
  _id?: string;
  idstudent: string;
  author: string;
  title: string;
  reports: string;
  date: string;
  // Student fields (denormalized)
  number?: string;
  name?: string;
  lastname?: string;
  username?: string;
  gender?: string;
  blood?: string;
  age?: string;
  curp?: string;
  email?: string;
  phone?: string;
  address?: string;
  disease?: string;
  allergy?: string;
  drug?: string;
  stigma?: string;
  treatment?: string;
  tutor?: string;
  stay?: string;
  file?: string;
  files?: FileObject[];
  description?: string;
  startdate?: Date | string;
  enddate?: string;
  service?: string;
  experience?: string;
  psychology?: string;
  sessions?: string;
  check?: number;
  medicine?: string;
  status?: StudentStatus;
  payments?: string[];
  softdelete?: boolean;
}

// Income Interface
export interface Income {
  _id?: string;
  iduser: string;
  title: string;
  concept: string;
  amount: number;
  source: string;
  category: string;
  date: Date | string;
  notes: string;
  deletedAt?: Date | string | null;
  profits: number;
}

// Expense Interface
export interface Expense {
  _id?: string;
  iduser: string;
  title: string;
  concept: string;
  amount: number;
  source: string;
  category: string;
  date: Date | string;
  notes: string;
  deletedAt?: Date | string | null;
  profits: number;
}

// ==================== AUTH TYPES ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol: string;
  photo?: string;
}

// Agregar esta interfaz para el formulario de registro con confirmPassword
export interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export interface AuthResponse {
  user: Login;
  token?: string; // Agregar token si tu backend lo devuelve
  message?: string;
}

export interface AuthState {
  user: Login | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Indica si ya se verificó localStorage al iniciar la app
  isLoading: boolean;
  error: string | null;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalStudents: number;
  totalUsers: number;
  totalPayments: number;
  totalIncome: number;
  totalExpense: number;
  profits: number;
  activeStudents: number;
  pendingPayments: number;
}

export interface ChartData {
  name: string;
  value: number;
}

// ==================== PAGINATION TYPES ====================

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== MULTIMEDIA TYPES ====================

// Video Enums
export enum VideoCategory {
  PRESUPUESTO = 'Presupuesto',
  AHORRO = 'Ahorro',
  INVERSIÓN = 'Inversión',
  DEUDAS = 'Deudas',
  EDUCACIÓN_FINANCIERA = 'Educación Financiera',
  TIPS = 'Tips',
}

export enum VideoLevel {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

// Article Enums
export enum ArticleType {
  TIP = 'tip',
  NOTICIA = 'noticia',
  GUIA = 'guia',
}

export enum ArticleCategory {
  AHORRO = 'Ahorro',
  INVERSIÓN = 'Inversión',
  PRESUPUESTO = 'Presupuesto',
  DEUDAS = 'Deudas',
  GENERAL = 'General',
}

export enum ArticleLevel {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

// Video Interface
export interface Video {
  _id?: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
  duration?: number;
  durationFormatted?: string;
  category: VideoCategory | string;
  tags?: string[];
  isOwnContent?: boolean;
  author?: string;
  order?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  level?: VideoLevel | string;
  views?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

// Article Interface
export interface Article {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  type: ArticleType | string;
  category: ArticleCategory | string;
  coverImage?: string;
  tags?: string[];
  author: string;
  authorId?: string;
  readingTime?: number;
  isOwnContent?: boolean;
  externalUrl?: string;
  source?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishedAt?: Date | string;
  order?: number;
  views?: number;
  level?: ArticleLevel | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}
