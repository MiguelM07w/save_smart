import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../services/api.service';
import type { Login } from '../../types';
import UserForm from './UserForm';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import toast from 'react-hot-toast';
import './UsersPage.css';

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Login | null>(null);

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar usuario');
    },
  });

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const search = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
    );
  }, [users, searchTerm]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredUsers, 10);

  // Reset page when search changes
  useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const handleEdit = (user: Login) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: string, username: string) => {
    if (window.confirm(`¿Eliminar usuario "${username}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="users-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>👥 Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Nuevo Usuario
        </Button>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar por usuario, email, nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-stats">
          {totalItems} de {users.length} usuarios
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No hay usuarios registrados</p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-avatar">
                      {user.photo ? (
                        <img src={user.photo} alt={user.username} className="avatar-img" />
                      ) : (
                        <span>{user.username?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.email || '-'}</td>
                  <td>
                    <span className={`badge badge-${user.rol?.toLowerCase() || 'usuario'}`}>
                      {user.rol || 'Usuario'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(user)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(user._id!, user.username || 'este usuario')}
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

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={selectedUser}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default UsersPage;
