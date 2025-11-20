import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/notificationSlice';
import { paymentsApi } from '../../services/api.service';
import type { Payment, NotificationType } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  payment: Payment | null;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isEditing = !!payment;

  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    method: 'Cash',
    status: 'pending',
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        concept: payment.concept || '',
        amount: payment.amount?.toString() || '',
        method: payment.method || 'Cash',
        status: payment.status || 'pending',
      });
    }
  }, [payment]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Payment>) => paymentsApi.create(data),
    onSuccess: (createdPayment) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
      toast.success('Pago creado exitosamente');

      // Crear notificación según el estado
      if (createdPayment.status === 'pending') {
        dispatch(addNotification({
          type: 'payment_pending' as NotificationType,
          title: 'Pago Pendiente',
          message: `Recordatorio: Tienes un pago pendiente de $${createdPayment.amount} - ${createdPayment.concept}`,
          relatedId: createdPayment._id,
        }));
      } else if (createdPayment.status === 'completed') {
        dispatch(addNotification({
          type: 'payment_completed' as NotificationType,
          title: 'Pago Completado',
          message: `Pago de $${createdPayment.amount} completado - ${createdPayment.concept}`,
          relatedId: createdPayment._id,
        }));
      }

      onClose();
    },
    onError: () => toast.error('Error al crear pago'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Payment>) => paymentsApi.update(payment!._id!, data),
    onSuccess: (updatedPayment) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
      toast.success('Pago actualizado exitosamente');

      // Crear notificación si cambió el estado
      if (updatedPayment.status === 'completed' && payment?.status !== 'completed') {
        dispatch(addNotification({
          type: 'payment_completed' as NotificationType,
          title: 'Pago Completado',
          message: `Pago de $${updatedPayment.amount} completado - ${updatedPayment.concept}`,
          relatedId: updatedPayment._id,
        }));
      } else if (updatedPayment.status === 'cancelled') {
        dispatch(addNotification({
          type: 'payment_cancelled' as NotificationType,
          title: 'Pago Cancelado',
          message: `Pago de $${updatedPayment.amount} cancelado - ${updatedPayment.concept}`,
          relatedId: updatedPayment._id,
        }));
      }

      onClose();
    },
    onError: () => toast.error('Error al actualizar pago'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.concept || !formData.amount) {
      toast.error('Concepto y monto son requeridos');
      return;
    }

    if (!user?._id) {
      toast.error('Usuario no identificado');
      return;
    }

    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      userId: user._id, // Agregar userId automáticamente
    };

    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Editar Pago' : '➕ Nuevo Pago'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Información del Pago</h3>
            <div className="form-group">
              <label>Concepto *</label>
              <input
                type="text"
                name="concept"
                value={formData.concept}
                onChange={handleChange}
                placeholder="Descripción del pago"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Monto *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="form-group">
                <label>Método de Pago</label>
                <select name="method" value={formData.method} onChange={handleChange}>
                  <option value="Cash">Efectivo</option>
                  <option value="Card">Tarjeta</option>
                  <option value="Transfer">Transferencia</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Crear Pago'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
