import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { studentsApi } from '../../services/api.service';
import { formatDate, getStatusColor } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import StudentForm from './StudentForm';
import type { Student } from '../../types';
import './StudentsPage.css';

const StudentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Fetch students
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentsApi.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    },
    onError: () => {
      toast.error('Error al eliminar estudiante');
    },
  });

  // Filter students
  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.curp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete?._id) {
      deleteMutation.mutate(studentToDelete._id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="students-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Gestión de Estudiantes</h1>
          <p>Administra los estudiantes y pacientes del centro</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          ➕ Nuevo Estudiante
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            className="input"
            placeholder="Buscar por nombre, apellido, email o CURP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline">🔍 Buscar</Button>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>CURP</th>
                <th>Teléfono</th>
                <th>Tratamiento</th>
                <th>Estado</th>
                <th>Fecha Inicio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents?.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron estudiantes
                  </td>
                </tr>
              ) : (
                filteredStudents?.map((student) => (
                  <tr key={student._id}>
                    <td>{student.number}</td>
                    <td>{`${student.name} ${student.lastname}`}</td>
                    <td>{student.email}</td>
                    <td>{student.curp}</td>
                    <td>{student.phone}</td>
                    <td>{student.treatment}</td>
                    <td>
                      <span
                        className="badge"
                        style={{ backgroundColor: getStatusColor(student.status) + '20', color: getStatusColor(student.status) }}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>{formatDate(student.startdate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(student)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(student)}
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
        <div className="pagination">
          <p>Mostrando {filteredStudents?.length || 0} de {students?.length || 0} estudiantes</p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        size="lg"
      >
        <StudentForm
          student={selectedStudent}
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
          ¿Estás seguro de que deseas eliminar al estudiante{' '}
          <strong>{studentToDelete?.name} {studentToDelete?.lastname}</strong>?
        </p>
        <p style={{ color: 'var(--danger-color)', marginTop: '1rem' }}>
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

export default StudentsPage;
