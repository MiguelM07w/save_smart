import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { incomeApi, expenseApi, usersApi, paymentsApi } from '../../services/api.service';
import { formatCurrency, calculateProfits, groupByKey, sumByKey } from '../../utils/helpers';
import { exportStatisticsToPDF, exportStatisticsToCSV } from '../../utils/exportUtils';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import './styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: incomes, isLoading: loadingIncomes } = useQuery({ queryKey: ['incomes'], queryFn: incomeApi.getAll });
  const { data: expenses, isLoading: loadingExpenses } = useQuery({ queryKey: ['expenses'], queryFn: expenseApi.getAll });
  const { data: users, isLoading: loadingUsers } = useQuery({ queryKey: ['users'], queryFn: usersApi.getAll });
  const { data: payments, isLoading: loadingPayments } = useQuery({ queryKey: ['payments'], queryFn: paymentsApi.getAll });

  const stats = useMemo(() => {
    const totalIncome = sumByKey(incomes || [], 'amount');
    const totalExpense = sumByKey(expenses || [], 'amount');
    const profits = calculateProfits(totalIncome, totalExpense);

    const incomeByCategory = Object.entries(groupByKey(incomes || [], 'category')).map(([category, items]) => ({
      category,
      amount: sumByKey(items as any[], 'amount'),
    }));

    const expenseByCategory = Object.entries(groupByKey(expenses || [], 'category')).map(([category, items]) => ({
      category,
      amount: sumByKey(items as any[], 'amount'),
    }));

    const incomeByUser = Object.entries(groupByKey(incomes || [], 'iduser')).map(([userId, items]) => ({
      userId,
      count: (items as any[]).length,
      total: sumByKey(items as any[], 'amount'),
    }));

    const expenseByUser = Object.entries(groupByKey(expenses || [], 'iduser')).map(([userId, items]) => ({
      userId,
      count: (items as any[]).length,
      total: sumByKey(items as any[], 'amount'),
    }));

    return {
      totalIncome,
      totalExpense,
      profits,
      incomeByCategory,
      expenseByCategory,
      incomeByUser,
      expenseByUser,
      totalUsers: users?.length || 0,
      totalPayments: payments?.length || 0,
      pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
    };
  }, [incomes, expenses, users, payments]);

  if (loadingIncomes || loadingExpenses || loadingUsers || loadingPayments) return <Loading />;

  const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];

  return (
    <div className="admin-dashboard">
      <div className="welcome-section">
        <h1>Panel de Administración</h1>
        <p>Vista global del sistema de gestión de gastos</p>
      </div>

      <div className="export-section card">
        <h3>Exportar Estadísticas Globales</h3>
        <div className="export-buttons">
          <Button variant="primary" onClick={() => exportStatisticsToPDF(stats, 'Estadísticas Globales')}>📄 Descargar PDF</Button>
          <Button variant="success" onClick={() => exportStatisticsToCSV(stats)}>📊 Descargar CSV</Button>
        </div>
      </div>

      <div className="quick-actions card">
        <h3>Accesos Rápidos</h3>
        <div className="action-cards">
          <div className="action-card" onClick={() => navigate('/admin/income')}>
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>💰</div>
            <h4>Ingresos</h4>
            <p>{formatCurrency(stats.totalIncome)}</p>
          </div>
          <div className="action-card" onClick={() => navigate('/admin/expenses')}>
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>💸</div>
            <h4>Gastos</h4>
            <p>{formatCurrency(stats.totalExpense)}</p>
          </div>
          <div className="action-card" onClick={() => navigate('/admin/users')}>
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>👥</div>
            <h4>Usuarios</h4>
            <p>{stats.totalUsers} registrados</p>
          </div>
          <div className="action-card" onClick={() => navigate('/admin/payments')}>
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>💳</div>
            <h4>Pagos</h4>
            <p>{stats.pendingPayments} pendientes</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card income-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Ingresos Totales</p>
            <h3 className="stat-value">{formatCurrency(stats.totalIncome)}</h3>
            <p className="stat-detail">{incomes?.length || 0} transacciones</p>
          </div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <p className="stat-label">Gastos Totales</p>
            <h3 className="stat-value">{formatCurrency(stats.totalExpense)}</h3>
            <p className="stat-detail">{expenses?.length || 0} transacciones</p>
          </div>
        </div>

        <div className="stat-card profit-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Balance Global</p>
            <h3 className="stat-value" style={{ color: stats.profits >= 0 ? '#22c55e' : '#ef4444' }}>
              {formatCurrency(stats.profits)}
            </h3>
            <p className="stat-detail">{stats.profits >= 0 ? 'Superávit' : 'Déficit'}</p>
          </div>
        </div>

        <div className="stat-card users-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">Usuarios Activos</p>
            <h3 className="stat-value">{stats.totalUsers}</h3>
            <p className="stat-detail">Total en el sistema</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-container">
          <h3 className="card-title">Distribución de Ingresos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.incomeByCategory} cx="50%" cy="50%" labelLine={false} label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`} outerRadius={100} fill="#8884d8" dataKey="amount">
                {stats.incomeByCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-container">
          <h3 className="card-title">Distribución de Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.expenseByCategory} cx="50%" cy="50%" labelLine={false} label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`} outerRadius={100} fill="#8884d8" dataKey="amount">
                {stats.expenseByCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-container" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Comparativa Global</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'Ingresos', amount: stats.totalIncome }, { name: 'Gastos', amount: stats.totalExpense }, { name: 'Balance', amount: stats.profits }]}>
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
    </div>
  );
};

export default AdminDashboard;
