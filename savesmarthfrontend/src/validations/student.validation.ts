import * as yup from 'yup';

export const studentSchema = yup.object().shape({
  number: yup.string().required('El número es requerido'),
  name: yup.string().required('El nombre es requerido'),
  lastname: yup.string().required('El apellido es requerido'),
  username: yup.string().required('El usuario es requerido'),
  gender: yup.string().required('El género es requerido'),
  blood: yup.string().required('El tipo de sangre es requerido'),
  age: yup.string().required('La edad es requerida'),
  curp: yup
    .string()
    .min(18, 'El CURP debe tener 18 caracteres')
    .max(18, 'El CURP debe tener 18 caracteres')
    .required('El CURP es requerido'),
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: yup.string().required('El teléfono es requerido'),
  address: yup.string().required('La dirección es requerida'),
  disease: yup.string(),
  allergy: yup.string(),
  drug: yup.string(),
  stigma: yup.string(),
  treatment: yup.string(),
  tutor: yup.string().required('El tutor es requerido'),
  stay: yup.string(),
  file: yup.string(),
  description: yup.string(),
  startdate: yup.date().required('La fecha de inicio es requerida'),
  enddate: yup.string(),
  service: yup.string(),
  experience: yup.string(),
  psychology: yup.string(),
  sessions: yup.string(),
  check: yup.number(),
  medicine: yup.string(),
  status: yup
    .string()
    .oneOf(['Baja', 'En Tratamiento', 'Egresado'], 'Estado inválido')
    .required('El estado es requerido'),
});
