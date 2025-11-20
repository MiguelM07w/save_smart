import { debounce, orderBy, groupBy, sumBy, isEmpty, isNil } from 'lodash';
import { format, parseISO, formatDistance, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// ==================== DATE HELPERS ====================

export const formatDate = (date: string | Date, formatString: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString, { locale: es }) : 'Fecha inválida';
  } catch (error) {
    return 'Fecha inválida';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? formatDistance(dateObj, new Date(), { addSuffix: true, locale: es }) : 'Fecha inválida';
  } catch (error) {
    return 'Fecha inválida';
  }
};

// ==================== CURRENCY HELPERS ====================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
};

// ==================== STRING HELPERS ====================

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getInitials = (name: string, lastname?: string): string => {
  if (!name) return '';
  const first = name.charAt(0).toUpperCase();
  const last = lastname ? lastname.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

// ==================== ARRAY HELPERS ====================

export const sortArray = <T>(
  array: T[],
  key: string | string[],
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return orderBy(array, key, order);
};

export const groupByKey = <T>(array: T[], key: string) => {
  return groupBy(array, key);
};

export const sumByKey = <T>(array: T[], key: string): number => {
  return sumBy(array, key as any);
};

// ==================== OBJECT HELPERS ====================

export const isEmptyObject = (obj: any): boolean => {
  return isEmpty(obj);
};

export const isNullOrUndefined = (value: any): boolean => {
  return isNil(value);
};

export const removeEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!isNil(value) && value !== '') {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

// ==================== SEARCH/FILTER HELPERS ====================

export const createDebouncedSearch = (callback: (value: string) => void, delay: number = 500) => {
  return debounce(callback, delay);
};

export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] => {
  if (!searchTerm) return items;

  const lowerSearch = searchTerm.toLowerCase();

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearch);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowerSearch);
      }
      return false;
    })
  );
};

// ==================== VALIDATION HELPERS ====================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidCURP = (curp: string): boolean => {
  return curp.length === 18;
};

// ==================== FILE HELPERS ====================

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ==================== STATUS HELPERS ====================

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Student/User status
    Baja: '#ef4444',
    'En Tratamiento': '#3b82f6',
    Egresado: '#22c55e',
    Activo: '#22c55e',
    // Payment status
    pending: '#f59e0b',
    completed: '#22c55e',
    cancelled: '#ef4444',
  };

  return statusColors[status] || '#6b7280';
};

export const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };

  return statusLabels[status] || status;
};

// ==================== PAGINATION HELPERS ====================

export const paginate = <T>(items: T[], page: number, limit: number): T[] => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return items.slice(startIndex, endIndex);
};

export const getTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

// ==================== CALCULATION HELPERS ====================

export const calculateProfits = (totalIncome: number, totalExpense: number): number => {
  return totalIncome - totalExpense;
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

// ==================== EXPORT ALL ====================

export default {
  // Date
  formatDate,
  formatDateTime,
  formatRelativeTime,
  // Currency
  formatCurrency,
  parseCurrency,
  // String
  truncateText,
  capitalizeFirstLetter,
  getInitials,
  // Array
  sortArray,
  groupByKey,
  sumByKey,
  // Object
  isEmptyObject,
  isNullOrUndefined,
  removeEmptyFields,
  // Search
  createDebouncedSearch,
  filterBySearch,
  // Validation
  isValidEmail,
  isValidPhone,
  isValidCURP,
  // File
  getFileExtension,
  isImageFile,
  convertToBase64,
  // Status
  getStatusColor,
  getStatusLabel,
  // Pagination
  paginate,
  getTotalPages,
  // Calculation
  calculateProfits,
  calculatePercentage,
  calculateAverage,
};
