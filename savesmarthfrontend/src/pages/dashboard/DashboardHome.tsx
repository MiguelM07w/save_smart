import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { studentsApi, usersApi, paymentsApi, incomeApi, expenseApi } from '../../services/api.service';
import { formatCurrency, calculateProfits } from '../../utils/helpers';
import Loading from '../../components/common/Loading';
import './DashboardHome.css';

const DashboardHome: React.FC = () => {
  // Fetch data using React Query
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.getAll,
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsApi.getAll,
  });

  const { data: incomes, isLoading: loadingIncomes } = useQuery({
    queryKey: ['incomes'],
    queryFn: incomeApi.getAll,
  });

  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseApi.getAll,
  });

  // Loading state
  if (loadingStudents || loadingUsers || loadingPayments || loadingIncomes || loadingExpenses) {
    return <Loading />;
  }

  // Calculate statistics
  const totalStudents = students?.length || 0;
  const activeStudents = students?.filter(s => s.status === 'En Tratamiento').length || 0;
  const totalUsers = users?.length || 0;
  const totalPayments = payments?.length || 0;
  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;

  const totalIncome = incomes?.reduce((sum, income) => sum + income.amount, 0) || 0;
  const totalExpense = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const profits = calculateProfits(totalIncome, totalExpense);

  // Prepare chart data
  const studentsByStatus = [
    { name: 'En Tratamiento', value: students?.filter(s => s.status === 'En Tratamiento').length || 0 },
    { name: 'Egresado', value: students?.filter(s => s.status === 'Egresado').length || 0 },
    { name: 'Baja', value: students?.filter(s => s.status === 'Baja').length || 0 },
  ];

  const paymentsByStatus = [
    { name: 'Pendiente', value: payments?.filter(p => p.status === 'pending').length || 0 },
    { name: 'Completado', value: payments?.filter(p => p.status === 'completed').length || 0 },
    { name: 'Cancelado', value: payments?.filter(p => p.status === 'cancelled').length || 0 },
  ];

  const financialData = [
    { name: 'Ingresos', amount: totalIncome },
    { name: 'Gastos', amount: totalExpense },
    { name: 'Ganancias', amount: profits },
  ];

  const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'];

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h1>Bienvenido al Panel de Control</h1>
        <p>Aquí tienes un resumen de las estadísticas más importantes</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            👥
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Estudiantes</p>
            <h3 className="stat-value">{totalStudents}</h3>
            <p className="stat-detail">{activeStudents} en tratamiento</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            👨‍⚕️
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Personal</p>
            <h3 className="stat-value">{totalUsers}</h3>
            <p className="stat-detail">Personal activo</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            💳
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Pagos</p>
            <h3 className="stat-value">{totalPayments}</h3>
            <p className="stat-detail">{pendingPayments} pendientes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            💰
          </div>
          <div className="stat-info">
            <p className="stat-label">Ganancias</p>
            <h3 className="stat-value">{formatCurrency(profits)}</h3>
            <p className="stat-detail">Balance total</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Student Status Chart */}
        <div className="card chart-container">
          <h3 className="card-title">Estudiantes por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {studentsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Chart */}
        <div className="card chart-container">
          <h3 className="card-title">Pagos por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Chart */}
        <div className="card chart-container" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Resumen Financiero</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="card-title">Actividad Reciente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">➕</div>
            <div className="activity-info">
              <p className="activity-title">Nuevo estudiante registrado</p>
              <p className="activity-time">Hace 2 horas</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💳</div>
            <div className="activity-info">
              <p className="activity-title">Pago completado</p>
              <p className="activity-time">Hace 5 horas</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📋</div>
            <div className="activity-info">
              <p className="activity-title">Nuevo reporte generado</p>
              <p className="activity-time">Hace 1 día</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
