import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../../services/api.service';
import type { Payment } from '../../types';
import PaymentForm from './PaymentForm';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './PaymentsPage.css';

const PaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pago eliminado exitosamente');
    },
    onError: () => toast.error('Error al eliminar pago'),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pago completado exitosamente');
    },
    onError: () => toast.error('Error al completar pago'),
  });

  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    const search = searchTerm.toLowerCase();
    return payments.filter(
      (payment) =>
        payment.concept?.toLowerCase().includes(search) ||
        payment.method?.toLowerCase().includes(search)
    );
  }, [payments, searchTerm]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredPayments, 10);

  // Reset page when search changes
  useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  if (isLoading) return <Loading />;

  return (
    <div className="payments-page">
      <div className="page-header">
        <div>
          <h1>💳 Gestión de Pagos</h1>
          <p>Administra los pagos del sistema</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Nuevo Pago
        </Button>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar por concepto o método..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-stats">
          {totalItems} de {payments.length} pagos
        </div>
      </div>

      <div className="table-container">
        <table className="payments-table">
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
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No hay pagos registrados</p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((payment) => (
                <tr key={payment._id}>
                  <td><strong>{payment.concept}</strong></td>
                  <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`method-badge method-${payment.method?.toLowerCase()}`}>
                      {payment.method}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${payment.status?.toLowerCase()}`}>
                      {payment.status || 'Pending'}
                    </span>
                  </td>
                  <td>{payment.createdAt ? formatDate(payment.createdAt) : '-'}</td>
                  <td>
                    <div className="actions">
                      {payment.status !== 'completed' && (
                        <button
                          className="btn-icon btn-complete"
                          onClick={() => completeMutation.mutate(payment._id)}
                          title="Completar"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => { setSelectedPayment(payment); setShowForm(true); }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar pago "${payment.concept}"?`)) {
                            deleteMutation.mutate(payment._id);
                          }
                        }}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
        />
      </div>

      {showForm && (
        <PaymentForm
          payment={selectedPayment}
          onClose={() => { setShowForm(false); setSelectedPayment(null); }}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
