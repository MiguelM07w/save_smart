import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .required('El usuario es requerido'),
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es requerido'),
  rol: yup
    .string()
    .default('Usuario') // Agregué valor por defecto
    .required('El rol es requerido'),
  photo: yup.string().optional(), // Marcado como opcional explícitamente
});

// Tipos inferidos de los esquemas
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;