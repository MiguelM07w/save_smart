import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { incomeApi, expenseApi } from '../../services/api.service';
import type { Income, Expense } from '../../types/index';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './styles/UserHome.css';

/* ============== Íconos SF-like inline (sin librerías) ============== */
type IconProps = { size?: number; className?: string };

const SfArrowUpCircle: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16V9" />
    <path d="M8.5 12.5L12 9l3.5 3.5" />
  </svg>
);

const SfArrowDownCircle: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v7" />
    <path d="M15.5 11.5L12 15 8.5 11.5" />
  </svg>
);

const SfChartUp: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M3 20h18" />
    <path d="M4 15l5-5 4 4 6-6" />
    <path d="M16 8h3v3" />
  </svg>
);

const SfChartDown: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M3 20h18" />
    <path d="M4 9l5 5 4-4 6 6" />
    <path d="M16 13h3v-3" />
  </svg>
);

const SfFolder: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const SfCalendar: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);

const SfSearch: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const SfTrash: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6l1-2h6l1 2" />
    <rect x="6" y="6" width="12" height="14" rx="2" />
    <path d="M10 10v6M14 10v6" />
  </svg>
);

const SfPlusCircle: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

const SfInbox: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M3 12l3-7h12l3 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M3 12h6l1.5 2h3L15 12h6" />
  </svg>
);

const SfSpinner: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </svg>
);
/* ===================================================== */

const UserHome: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State for forms
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    concept: '',
    amount: '',
    category: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    concept: '',
    amount: '',
    category: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // State for search
  const [incomeSearch, setIncomeSearch] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');

  // Fetch data
  const { data: allIncomes = [], isLoading: loadingIncomes } = useQuery({
    queryKey: ['incomes'],
    queryFn: incomeApi.getAll,
  });

  const { data: allExpenses = [], isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseApi.getAll,
  });

  // Filter user's data
  const userIncomes = useMemo(
    () => allIncomes.filter((income) => income.iduser === user?._id) || [],
    [allIncomes, user]
  );

  const userExpenses = useMemo(
    () => allExpenses.filter((expense) => expense.iduser === user?._id) || [],
    [allExpenses, user]
  );

  // Filtered lists
  const filteredIncomes = useMemo(() => {
    if (!incomeSearch) return userIncomes;
    return userIncomes.filter(
      (income) =>
        income.title.toLowerCase().includes(incomeSearch.toLowerCase()) ||
        income.concept.toLowerCase().includes(incomeSearch.toLowerCase()) ||
        income.category.toLowerCase().includes(incomeSearch.toLowerCase())
    );
  }, [userIncomes, incomeSearch]);

  const filteredExpenses = useMemo(() => {
    if (!expenseSearch) return userExpenses;
    return userExpenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        expense.concept.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        expense.category.toLowerCase().includes(expenseSearch.toLowerCase())
    );
  }, [userExpenses, expenseSearch]);

  // Calculate totals
  const totalIncome = useMemo(
    () => userIncomes.reduce((sum, income) => sum + income.amount, 0),
    [userIncomes]
  );

  const totalExpense = useMemo(
    () => userExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [userExpenses]
  );

  const balance = totalIncome - totalExpense;

  // Mutations
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

  const deleteIncomeMutation = useMutation({
    mutationFn: (id: string) => incomeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      toast.success('Ingreso eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar ingreso');
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Gasto eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar gasto');
    },
  });

  // Submit handlers
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
    <div className="user-home">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income-card">
          <div className="card-icon">
            <SfArrowUpCircle />
          </div>
          <div className="card-content">
            <h3>Total Ingresos</h3>
            <p className="card-amount">{formatCurrency(totalIncome)}</p>
            <span className="card-count">{userIncomes.length} transacciones</span>
          </div>
        </div>

        <div className="summary-card expense-card">
          <div className="card-icon">
            <SfArrowDownCircle />
          </div>
          <div className="card-content">
            <h3>Total Gastos</h3>
            <p className="card-amount">{formatCurrency(totalExpense)}</p>
            <span className="card-count">{userExpenses.length} transacciones</span>
          </div>
        </div>

        <div className={`summary-card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">
            {balance >= 0 ? <SfChartUp /> : <SfChartDown />}
          </div>
          <div className="card-content">
            <h3>Balance</h3>
            <p className="card-amount">{formatCurrency(balance)}</p>
            <span className="card-count">{balance >= 0 ? 'Superávit' : 'Déficit'}</span>
          </div>
        </div>
      </div>

      {/* Transactions Lists */}
      <div className="transactions-section">
        <div className="transaction-column">
          <div className="column-header">
            <h2><span className="title-icon"><SfArrowUpCircle /></span> Mis Ingresos</h2>
            <div className="search-wrapper">
              <SfSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar ingresos..."
                value={incomeSearch}
                onChange={(e) => setIncomeSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="transaction-list">
            {loadingIncomes ? (
              <div className="loading-state">
                <SfSpinner className="spin" /> Cargando ingresos...
              </div>
            ) : filteredIncomes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><SfInbox /></span>
                <p>No hay ingresos registrados</p>
              </div>
            ) : (
              filteredIncomes.map((income) => (
                <div key={income._id} className="transaction-item income-item">
                  <div className="item-header">
                    <h4>{income.title}</h4>
                    <span className="item-amount positive">{formatCurrency(income.amount)}</span>
                  </div>
                  <div className="item-details">
                    <span className="item-tag"><SfFolder className="tag-icon" /> {income.category}</span>
                    <span className="item-tag"><SfCalendar className="tag-icon" /> {formatDate(income.date)}</span>
                  </div>
                  <p className="item-concept">{income.concept}</p>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => {
                        if (window.confirm('¿Eliminar este ingreso?')) {
                          deleteIncomeMutation.mutate(income._id);
                        }
                      }}
                      aria-label="Eliminar ingreso"
                    >
                      <SfTrash className="btn-icon" /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="transaction-column">
          <div className="column-header">
            <h2><span className="title-icon"><SfArrowDownCircle /></span> Mis Gastos</h2>
            <div className="search-wrapper">
              <SfSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar gastos..."
                value={expenseSearch}
                onChange={(e) => setExpenseSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="transaction-list">
            {loadingExpenses ? (
              <div className="loading-state">
                <SfSpinner className="spin" /> Cargando gastos...
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><SfInbox /></span>
                <p>No hay gastos registrados</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div key={expense._id} className="transaction-item expense-item">
                  <div className="item-header">
                    <h4>{expense.title}</h4>
                    <span className="item-amount negative">{formatCurrency(expense.amount)}</span>
                  </div>
                  <div className="item-details">
                    <span className="item-tag"><SfFolder className="tag-icon" /> {expense.category}</span>
                    <span className="item-tag"><SfCalendar className="tag-icon" /> {formatDate(expense.date)}</span>
                  </div>
                  <p className="item-concept">{expense.concept}</p>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => {
                        if (window.confirm('¿Eliminar este gasto?')) {
                          deleteExpenseMutation.mutate(expense._id);
                        }
                      }}
                      aria-label="Eliminar gasto"
                    >
                      <SfTrash className="btn-icon" /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="forms-section">
        <div className="form-column">
          <div className="form-card income-form-card">
            <h3><span className="title-icon"><SfPlusCircle /></span> Agregar Ingreso</h3>
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

              <button type="submit" className="submit-btn income-btn" disabled={createIncomeMutation.isPending} aria-busy={createIncomeMutation.isPending}>
                {createIncomeMutation.isPending ? (
                  <>
                    <SfSpinner className="btn-icon spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <SfPlusCircle className="btn-icon" /> Guardar Ingreso
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="form-column">
          <div className="form-card expense-form-card">
            <h3><span className="title-icon"><SfPlusCircle /></span> Agregar Gasto</h3>
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

              <button type="submit" className="submit-btn expense-btn" disabled={createExpenseMutation.isPending} aria-busy={createExpenseMutation.isPending}>
                {createExpenseMutation.isPending ? (
                  <>
                    <SfSpinner className="btn-icon spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <SfPlusCircle className="btn-icon" /> Guardar Gasto
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;