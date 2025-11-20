import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { studentsApi } from '../../services/api.service';
import { studentSchema } from '../../validations/student.validation';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import type { Student } from '../../types';

interface StudentFormProps {
  student: Student | null;
  onSuccess: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEdit = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<Student>>({
    resolver: yupResolver(studentSchema),
    defaultValues: student || {
      status: 'En Tratamiento',
      files: [],
      check: 0,
      softdelete: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Student>) => studentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante creado exitosamente');
      onSuccess();
    },
    onError: () => {
      toast.error('Error al crear estudiante');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante actualizado exitosamente');
      onSuccess();
    },
    onError: () => {
      toast.error('Error al actualizar estudiante');
    },
  });

  const onSubmit = (data: Partial<Student>) => {
    if (isEdit && student._id) {
      updateMutation.mutate({ id: student._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="student-form">
      <div className="form-grid">
        {/* Basic Information */}
        <div className="form-section" style={{ gridColumn: 'span 2' }}>
          <h4>Información Básica</h4>
        </div>

        <Input
          {...register('number')}
          label="Número"
          placeholder="001"
          error={errors.number?.message}
        />

        <Input
          {...register('name')}
          label="Nombre"
          placeholder="Juan"
          error={errors.name?.message}
        />

        <Input
          {...register('lastname')}
          label="Apellido"
          placeholder="Pérez"
          error={errors.lastname?.message}
        />

        <Input
          {...register('username')}
          label="Usuario"
          placeholder="juan.perez"
          error={errors.username?.message}
        />

        <div className="input-group">
          <label className="label">Género</label>
          <select {...register('gender')} className="select">
            <option value="">Seleccionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.gender && <span className="error-message">{errors.gender.message}</span>}
        </div>

        <Input
          {...register('age')}
          label="Edad"
          type="number"
          placeholder="25"
          error={errors.age?.message}
        />

        <Input
          {...register('blood')}
          label="Tipo de Sangre"
          placeholder="O+"
          error={errors.blood?.message}
        />

        <Input
          {...register('curp')}
          label="CURP"
          placeholder="ABCD123456HDFABC12"
          error={errors.curp?.message}
          maxLength={18}
        />

        {/* Contact Information */}
        <div className="form-section" style={{ gridColumn: 'span 2' }}>
          <h4>Información de Contacto</h4>
        </div>

        <Input
          {...register('email')}
          label="Email"
          type="email"
          placeholder="juan@email.com"
          error={errors.email?.message}
        />

        <Input
          {...register('phone')}
          label="Teléfono"
          placeholder="5551234567"
          error={errors.phone?.message}
        />

        <Input
          {...register('address')}
          label="Dirección"
          placeholder="Calle 123, Colonia..."
          error={errors.address?.message}
          style={{ gridColumn: 'span 2' }}
        />

        {/* Medical Information */}
        <div className="form-section" style={{ gridColumn: 'span 2' }}>
          <h4>Información Médica</h4>
        </div>

        <Input
          {...register('disease')}
          label="Enfermedad"
          placeholder="Descripción de la enfermedad"
          error={errors.disease?.message}
        />

        <Input
          {...register('allergy')}
          label="Alergias"
          placeholder="Alergias conocidas"
          error={errors.allergy?.message}
        />

        <Input
          {...register('drug')}
          label="Medicamentos"
          placeholder="Medicamentos actuales"
          error={errors.drug?.message}
        />

        <Input
          {...register('medicine')}
          label="Medicina Adicional"
          placeholder="Otra medicina"
          error={errors.medicine?.message}
        />

        {/* Treatment Information */}
        <div className="form-section" style={{ gridColumn: 'span 2' }}>
          <h4>Información de Tratamiento</h4>
        </div>

        <Input
          {...register('treatment')}
          label="Tratamiento"
          placeholder="Descripción del tratamiento"
          error={errors.treatment?.message}
          style={{ gridColumn: 'span 2' }}
        />

        <Input
          {...register('psychology')}
          label="Psicología"
          placeholder="Información psicológica"
          error={errors.psychology?.message}
        />

        <Input
          {...register('sessions')}
          label="Sesiones"
          placeholder="Número de sesiones"
          error={errors.sessions?.message}
        />

        <Input
          {...register('tutor')}
          label="Tutor/Guardian"
          placeholder="Nombre del tutor"
          error={errors.tutor?.message}
        />

        <Input
          {...register('stay')}
          label="Estancia"
          placeholder="Tipo de estancia"
          error={errors.stay?.message}
        />

        <Input
          {...register('startdate')}
          label="Fecha de Inicio"
          type="date"
          error={errors.startdate?.message}
        />

        <Input
          {...register('enddate')}
          label="Fecha de Fin"
          placeholder="Fecha estimada de fin"
          error={errors.enddate?.message}
        />

        <div className="input-group">
          <label className="label">Estado</label>
          <select {...register('status')} className="select">
            <option value="En Tratamiento">En Tratamiento</option>
            <option value="Egresado">Egresado</option>
            <option value="Baja">Baja</option>
          </select>
          {errors.status && <span className="error-message">{errors.status.message}</span>}
        </div>

        <Input
          {...register('service')}
          label="Servicio"
          placeholder="Tipo de servicio"
          error={errors.service?.message}
        />

        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label className="label">Descripción</label>
          <textarea
            {...register('description')}
            className="textarea"
            rows={3}
            placeholder="Descripción adicional del estudiante..."
          />
          {errors.description && <span className="error-message">{errors.description.message}</span>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          {isEdit ? 'Actualizar' : 'Crear'} Estudiante
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
