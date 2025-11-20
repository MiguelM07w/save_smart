import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { expenseApi } from '../../services/api.service';
import { incomeExpenseSchema } from '../../validations/payment.validation';
import { useAppSelector } from '../../store/hooks';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import type { Expense } from '../../types';

interface ExpenseFormProps {
  expense: Expense | null;
  onSuccess: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSuccess }) => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const isEdit = !!expense;

  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Expense>>({
    resolver: yupResolver(incomeExpenseSchema),
    defaultValues: expense || { iduser: user?._id, date: new Date().toISOString().split('T')[0] },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Expense>) => expenseApi.create({ ...data, iduser: user?._id || '' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Gasto creado'); onSuccess(); },
    onError: () => toast.error('Error al crear gasto'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Expense> }) => expenseApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Gasto actualizado'); onSuccess(); },
    onError: () => toast.error('Error al actualizar gasto'),
  });

  const onSubmit = (data: Partial<Expense>) => {
    if (isEdit && expense._id) {
      updateMutation.mutate({ id: expense._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="student-form">
      <div className="form-grid">
        <Input {...register('title')} label="Título" placeholder="Compra de oficina" error={errors.title?.message} />
        <Input {...register('concept')} label="Concepto" placeholder="Materiales" error={errors.concept?.message} />
        <Input {...register('amount')} label="Monto" type="number" step="0.01" placeholder="500.00" error={errors.amount?.message} />
        <Input {...register('date')} label="Fecha" type="date" error={errors.date?.message} />
        <Input {...register('category')} label="Categoría" placeholder="Oficina, Servicios, Comida, etc." error={errors.category?.message} />
        <Input {...register('source')} label="Fuente" placeholder="Tienda, Proveedor, etc." error={errors.source?.message} />
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label className="label">Notas</label>
          <textarea {...register('notes')} className="textarea" rows={3} placeholder="Notas adicionales..." />
        </div>
      </div>
      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" variant="danger" loading={createMutation.isPending || updateMutation.isPending}>{isEdit ? 'Actualizar' : 'Crear'} Gasto</Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
