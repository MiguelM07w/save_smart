import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { incomeApi } from '../../services/api.service';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import IncomeForm from './IncomeForm';
import type { Income } from '../../types';
import './IncomePage.css';

const IncomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);

  // Fetch incomes
  const { data: incomes, isLoading } = useQuery({
    queryKey: ['incomes'],
    queryFn: incomeApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => incomeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      toast.success('Ingreso eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setIncomeToDelete(null);
    },
    onError: () => {
      toast.error('Error al eliminar ingreso');
    },
  });

  // Filter incomes
  const filteredIncomes = incomes?.filter(income =>
    income.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    income.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    income.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    income.source.toLowerCase().includes(searchTerm.toLowerCase())
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
  } = usePagination(filteredIncomes, 10);

  // Reset page when search changes
  useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const handleCreate = () => {
    setSelectedIncome(null);
    setIsModalOpen(true);
  };

  const handleEdit = (income: Income) => {
    setSelectedIncome(income);
    setIsModalOpen(true);
  };

  const handleDelete = (income: Income) => {
    setIncomeToDelete(income);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (incomeToDelete?._id) {
      deleteMutation.mutate(incomeToDelete._id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIncome(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  const totalIncome = incomes?.reduce((sum, income) => sum + income.amount, 0) || 0;

  return (
    <div className="income-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Gestión de Ingresos</h1>
          <p>Administra los ingresos del sistema</p>
          <p style={{ marginTop: '0.5rem', fontWeight: '600', color: 'var(--success-color)' }}>
            Total: {formatCurrency(totalIncome)}
          </p>
        </div>
        <Button variant="success" onClick={handleCreate}>
          ➕ Nuevo Ingreso
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            className="input"
            placeholder="Buscar por título, concepto, categoría o fuente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline">🔍 Buscar</Button>
        </div>
      </div>

      {/* Incomes Table */}
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
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron ingresos
                  </td>
                </tr>
              ) : (
                paginatedItems.map((income) => (
                  <tr key={income._id}>
                    <td>{formatDate(income.date)}</td>
                    <td>{income.title}</td>
                    <td>{income.concept}</td>
                    <td style={{ color: 'var(--success-color)', fontWeight: '600' }}>
                      {formatCurrency(income.amount)}
                    </td>
                    <td>{income.category}</td>
                    <td>{income.source}</td>
                    <td style={{ color: income.profits >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: '600' }}>
                      {formatCurrency(income.profits)}
                    </td>
                    <td>{income.notes || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(income)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(income)}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedIncome ? 'Editar Ingreso' : 'Nuevo Ingreso'}
        size="md"
      >
        <IncomeForm
          income={selectedIncome}
          onSuccess={handleModalClose}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteMutation.isPending}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <p>
          ¿Estás seguro de que deseas eliminar el ingreso{' '}
          <strong>{incomeToDelete?.title}</strong>?
        </p>
        <p style={{ color: 'var(--danger-color)', marginTop: '1rem' }}>
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

export default IncomePage;
