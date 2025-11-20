import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../../services/api.service';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/notificationSlice';
import type { Payment, NotificationType } from '../../types';
import PaymentForm from './PaymentForm';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import './UserPayments.css';

const UserPayments: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['userPayments', user?._id],
    queryFn: () => paymentsApi.getByUser(user!._id!),
    enabled: !!user?._id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
      toast.success('Pago eliminado');
    },
    onError: () => toast.error('Error al eliminar pago'),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.complete(id),
    onSuccess: (updatedPayment) => {
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
      toast.success('Pago marcado como completado');

      // Notificación de pago completado
      dispatch(addNotification({
        type: 'payment_completed' as NotificationType,
        title: 'Pago Completado',
        message: `Pago de $${updatedPayment.amount} completado - ${updatedPayment.concept}`,
        relatedId: updatedPayment._id,
      }));
    },
    onError: () => toast.error('Error al completar pago'),
  });

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowForm(true);
  };

  const handleNew = () => {
    setSelectedPayment(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedPayment(null);
  };

  const filteredPayments = payments.filter(p =>
    filter === 'all' ? true : p.status === filter
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <span className="badge badge-warning">Pendiente</span>,
      completed: <span className="badge badge-success">Completado</span>,
      cancelled: <span className="badge badge-error">Cancelado</span>,
    };
    return badges[status as keyof typeof badges] || status;
  };

  const summary = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    completed: payments.filter(p => p.status === 'completed').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  if (isLoading) {
    return <div className="loading">Cargando pagos...</div>;
  }

  return (
    <div className="user-payments">
      <div className="page-header">
        <div>
          <h1>💳 Mis Pagos</h1>
          <p>Gestiona tus pagos y recibe notificaciones</p>
        </div>
        <Button variant="primary" onClick={handleNew}>
          ➕ Nuevo Pago
        </Button>
      </div>

      {/* Resumen */}
      <div className="payment-summary">
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div>
            <div className="summary-value">{summary.total}</div>
            <div className="summary-label">Total Pagos</div>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">⏳</div>
          <div>
            <div className="summary-value">{summary.pending}</div>
            <div className="summary-label">Pendientes</div>
          </div>
        </div>
        <div className="summary-card success">
          <div className="summary-icon">✓</div>
          <div>
            <div className="summary-value">{summary.completed}</div>
            <div className="summary-label">Completados</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div>
            <div className="summary-value">${summary.pendingAmount.toFixed(2)}</div>
            <div className="summary-label">Por Pagar</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Todos ({payments.length})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pendientes ({summary.pending})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completados ({summary.completed})
        </button>
        <button
          className={filter === 'cancelled' ? 'active' : ''}
          onClick={() => setFilter('cancelled')}
        >
          Cancelados
        </button>
      </div>

      {/* Tabla de Pagos */}
      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No hay pagos {filter !== 'all' && filter}</h3>
          <p>Crea tu primer pago usando el botón "Nuevo Pago"</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td className="font-medium">{payment.concept}</td>
                  <td className="text-success font-medium">${payment.amount.toFixed(2)}</td>
                  <td>{payment.method}</td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>{new Date(payment.createdAt!).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {payment.status === 'pending' && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => completeMutation.mutate(payment._id!)}
                          title="Marcar como completado"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(payment)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => {
                          if (confirm('¿Eliminar este pago?')) {
                            deleteMutation.mutate(payment._id!);
                          }
                        }}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <PaymentForm
          payment={selectedPayment}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default UserPayments;
