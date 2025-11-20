import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { incomeApi } from '../../services/api.service';
import { incomeExpenseSchema } from '../../validations/payment.validation';
import { useAppSelector } from '../../store/hooks';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import type { Income } from '../../types';

interface IncomeFormProps {
  income: Income | null;
  onSuccess: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ income, onSuccess }) => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const isEdit = !!income;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<Income>>({
    resolver: yupResolver(incomeExpenseSchema),
    defaultValues: income || {
      iduser: user?._id,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Income>) => incomeApi.create({ ...data, iduser: user?._id || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      toast.success('Ingreso creado exitosamente');
      onSuccess();
    },
    onError: () => {
      toast.error('Error al crear ingreso');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Income> }) =>
      incomeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      toast.success('Ingreso actualizado exitosamente');
      onSuccess();
    },
    onError: () => {
      toast.error('Error al actualizar ingreso');
    },
  });

  const onSubmit = (data: Partial<Income>) => {
    if (isEdit && income._id) {
      updateMutation.mutate({ id: income._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="student-form">
      <div className="form-grid">
        <Input
          {...register('title')}
          label="Título"
          placeholder="Sueldo mensual"
          error={errors.title?.message}
        />

        <Input
          {...register('concept')}
          label="Concepto"
          placeholder="Pago de nómina"
          error={errors.concept?.message}
        />

        <Input
          {...register('amount')}
          label="Monto"
          type="number"
          step="0.01"
          placeholder="5000.00"
          error={errors.amount?.message}
        />

        <Input
          {...register('date')}
          label="Fecha"
          type="date"
          error={errors.date?.message}
        />

        <Input
          {...register('category')}
          label="Categoría"
          placeholder="Salario, Bonos, Inversiones, etc."
          error={errors.category?.message}
        />

        <Input
          {...register('source')}
          label="Fuente"
          placeholder="Empresa, Freelance, etc."
          error={errors.source?.message}
        />

        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label className="label">Notas</label>
          <textarea
            {...register('notes')}
            className="textarea"
            rows={3}
            placeholder="Notas adicionales..."
          />
          {errors.notes && <span className="error-message">{errors.notes.message}</span>}
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" loading={isLoading}>
          {isEdit ? 'Actualizar' : 'Crear'} Ingreso
        </Button>
      </div>
    </form>
  );
};

export default IncomeForm;
