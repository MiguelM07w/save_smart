import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { incomeApi, expenseApi } from '../../services/api.service';
import type { Income, Expense } from '../../types/index';
import toast from 'react-hot-toast';
import './styles/UserForms.css';

const UserForms: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Income form state
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    concept: '',
    amount: '',
    category: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    concept: '',
    amount: '',
    category: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Create income mutation
  const createIncomeMutation = useMutation({
    mutationFn: (data: Partial<Income>) =>
      incomeApi.create({ ...data, iduser: user?._id || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      toast.success('Ingreso creado exitosamente');
      setIncomeForm({
        title: '',
        concept: '',
        amount: '',
        category: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    },
    onError: () => {
      toast.error('Error al crear ingreso');
    },
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: (data: Partial<Expense>) =>
      expenseApi.create({ ...data, iduser: user?._id || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Gasto creado exitosamente');
      setExpenseForm({
        title: '',
        concept: '',
        amount: '',
        category: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    },
    onError: () => {
      toast.error('Error al crear gasto');
    },
  });

  // Handle income submit
  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.title || !incomeForm.amount || !incomeForm.category) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    createIncomeMutation.mutate({
      ...incomeForm,
      amount: parseFloat(incomeForm.amount),
    });
  };

  // Handle expense submit
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.category) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    createExpenseMutation.mutate({
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
    });
  };

  return (
    <div className="user-forms">
      <div className="forms-header">
        <h1>Agregar Transacciones</h1>
        <p>Registra tus ingresos y gastos de forma rápida y sencilla</p>
      </div>

      <div className="forms-grid">
        {/* Income Form */}
        <div className="form-card income-form">
          <div className="form-header income-header">
            <div className="header-icon">💰</div>
            <div>
              <h2>Nuevo Ingreso</h2>
              <p>Registra tus entradas de dinero</p>
            </div>
          </div>

          <form onSubmit={handleIncomeSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={incomeForm.title}
                  onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
                  placeholder="Ej: Salario mensual"
                  required
                />
              </div>
              <div className="form-group">
                <label>Monto *</label>
                <input
                  type="number"
                  step="0.01"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={incomeForm.category}
                  onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Salario">Salario</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Inversiones">Inversiones</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fuente</label>
                <input
                  type="text"
                  value={incomeForm.source}
                  onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                  placeholder="Ej: Empresa XYZ"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Concepto</label>
              <input
                type="text"
                value={incomeForm.concept}
                onChange={(e) => setIncomeForm({ ...incomeForm, concept: e.target.value })}
                placeholder="Descripción breve"
              />
            </div>

            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={incomeForm.date}
                onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Notas adicionales</label>
              <textarea
                value={incomeForm.notes}
                onChange={(e) => setIncomeForm({ ...incomeForm, notes: e.target.value })}
                placeholder="Información adicional (opcional)"
                rows={3}
              />
            </div>

            <button type="submit" className="submit-btn income-btn" disabled={createIncomeMutation.isPending}>
              {createIncomeMutation.isPending ? '💾 Guardando...' : '💰 Guardar Ingreso'}
            </button>
          </form>
        </div>

        {/* Expense Form */}
        <div className="form-card expense-form">
          <div className="form-header expense-header">
            <div className="header-icon">💸</div>
            <div>
              <h2>Nuevo Gasto</h2>
              <p>Registra tus salidas de dinero</p>
            </div>
          </div>

          <form onSubmit={handleExpenseSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  placeholder="Ej: Compra supermercado"
                  required
                />
              </div>
              <div className="form-group">
                <label>Monto *</label>
                <input
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Entretenimiento">Entretenimiento</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fuente</label>
                <input
                  type="text"
                  value={expenseForm.source}
                  onChange={(e) => setExpenseForm({ ...expenseForm, source: e.target.value })}
                  placeholder="Ej: Tarjeta de crédito"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Concepto</label>
              <input
                type="text"
                value={expenseForm.concept}
                onChange={(e) => setExpenseForm({ ...expenseForm, concept: e.target.value })}
                placeholder="Descripción breve"
              />
            </div>

            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Notas adicionales</label>
              <textarea
                value={expenseForm.notes}
                onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                placeholder="Información adicional (opcional)"
                rows={3}
              />
            </div>

            <button type="submit" className="submit-btn expense-btn" disabled={createExpenseMutation.isPending}>
              {createExpenseMutation.isPending ? '💾 Guardando...' : '💸 Guardar Gasto'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForms;
