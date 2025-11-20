import * as yup from 'yup';

export const paymentSchema = yup.object().shape({
  concept: yup.string().required('El concepto es requerido'),
  amount: yup
    .number()
    .positive('El monto debe ser positivo')
    .required('El monto es requerido'),
  method: yup.string().required('El método de pago es requerido'),
  status: yup
    .string()
    .oneOf(['pending', 'completed', 'cancelled'], 'Estado inválido')
    .required('El estado es requerido'),
  student: yup.string().required('El estudiante es requerido'),
  isScheduled: yup.boolean(),
  frequency: yup
    .string()
    .oneOf(['daily', 'weekly', 'friday', 'saturday'], 'Frecuencia inválida')
    .when('isScheduled', {
      is: true,
      then: (schema) => schema.required('La frecuencia es requerida'),
    }),
  dueDate: yup.date().required('La fecha de vencimiento es requerida'),
  startDate: yup.date().required('La fecha de inicio es requerida'),
});

export const incomeExpenseSchema = yup.object().shape({
  title: yup.string().required('El título es requerido'),
  concept: yup.string().required('El concepto es requerido'),
  amount: yup
    .number()
    .positive('El monto debe ser positivo')
    .required('El monto es requerido'),
  source: yup.string().required('La fuente es requerida'),
  category: yup.string().required('La categoría es requerida'),
  date: yup.date().required('La fecha es requerida'),
  notes: yup.string(),
});

export const reportSchema = yup.object().shape({
  author: yup.string().required('El autor es requerido'),
  title: yup.string().required('El título es requerido'),
  reports: yup.string().required('El reporte es requerido'),
  date: yup.string().required('La fecha es requerida'),
});
