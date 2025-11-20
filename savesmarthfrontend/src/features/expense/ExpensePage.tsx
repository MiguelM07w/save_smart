import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { expenseApi } from '../../services/api.service';
import { formatDate, formatCurrency } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import ExpenseForm from './ExpenseForm';
import type { Expense } from '../../types';
import './ExpensePage.css';

const ExpensePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Gasto eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    },
    onError: () => {
      toast.error('Error al eliminar gasto');
    },
  });

  const filteredExpenses = expenses?.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.source.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredExpenses, 10);

  // Reset page when search changes
  useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  if (isLoading) return <Loading />;

  const totalExpense = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  return (
    <div className="expense-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Gastos</h1>
          <p>Administra los gastos del sistema</p>
          <p style={{ marginTop: '0.5rem', fontWeight: '600', color: 'var(--danger-color)' }}>
            Total: {formatCurrency(totalExpense)}
          </p>
        </div>
        <Button variant="danger" onClick={() => { setSelectedExpense(null); setIsModalOpen(true); }}>
          ➕ Nuevo Gasto
        </Button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            className="input"
            placeholder="Buscar por título, concepto, categoría o fuente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Título</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Categoría</th>
                <th>Fuente</th>
                <th>Ganancias</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron gastos</td></tr>
              ) : (
                paginatedItems.map((expense) => (
                  <tr key={expense._id}>
                    <td>{formatDate(expense.date)}</td>
                    <td>{expense.title}</td>
                    <td>{expense.concept}</td>
                    <td style={{ color: 'var(--danger-color)', fontWeight: '600' }}>
                      {formatCurrency(expense.amount)}
                    </td>
                    <td>{expense.category}</td>
                    <td>{expense.source}</td>
                    <td style={{ color: expense.profits >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: '600' }}>
                      {formatCurrency(expense.profits)}
                    </td>
                    <td>{expense.notes || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-outline" onClick={() => { setSelectedExpense(expense); setIsModalOpen(true); }}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => { setExpenseToDelete(expense); setIsDeleteModalOpen(true); }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedExpense ? 'Editar Gasto' : 'Nuevo Gasto'} size="md">
        <ExpenseForm expense={selectedExpense} onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación" footer={<><Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button><Button variant="danger" onClick={() => expenseToDelete?._id && deleteMutation.mutate(expenseToDelete._id)} loading={deleteMutation.isPending}>Eliminar</Button></>}>
        <p>¿Estás seguro de que deseas eliminar el gasto <strong>{expenseToDelete?.title}</strong>?</p>
        <p style={{ color: 'var(--danger-color)', marginTop: '1rem' }}>Esta acción no se puede deshacer.</p>
      </Modal>
    </div>
  );
};

export default ExpensePage;
