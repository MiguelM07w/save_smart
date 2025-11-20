import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { incomeApi, expenseApi } from '../../services/api.service';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, groupByKey, sumByKey } from '../../utils/helpers';
import Loading from '../../components/common/Loading';
import './styles/UserCharts.css';

type FilterPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const UserCharts: React.FC = () => {
  const { user } = useAuth();
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('monthly');

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

  // Filter by period
  const filteredData = useMemo(() => {
    const now = new Date();
    const filterDate = (dateStr: Date | string) => {
      const date = new Date(dateStr);
      const diffTime = now.getTime() - date.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (filterPeriod) {
        case 'daily':
          return diffDays <= 1;
        case 'weekly':
          return diffDays <= 7;
        case 'monthly':
          return diffDays <= 30;
        case 'yearly':
          return diffDays <= 365;
        default:
          return true;
      }
    };

    return {
      incomes: userIncomes.filter((item) => filterDate(item.date)),
      expenses: userExpenses.filter((item) => filterDate(item.date)),
    };
  }, [userIncomes, userExpenses, filterPeriod]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = sumByKey(filteredData.incomes, 'amount');
    const totalExpense = sumByKey(filteredData.expenses, 'amount');
    const balance = totalIncome - totalExpense;

    // Group by category
    const incomeByCategory = Object.entries(groupByKey(filteredData.incomes, 'category')).map(
      ([category, items]) => ({
        category,
        amount: sumByKey(items as any[], 'amount'),
      })
    );

    const expenseByCategory = Object.entries(groupByKey(filteredData.expenses, 'category')).map(
      ([category, items]) => ({
        category,
        amount: sumByKey(items as any[], 'amount'),
      })
    );

    return {
      totalIncome,
      totalExpense,
      balance,
      incomeByCategory,
      expenseByCategory,
    };
  }, [filteredData]);

  if (loadingIncomes || loadingExpenses) {
    return <Loading />;
  }

  const COLORS = ['#667eea', '#48bb78', '#f56565', '#f6ad55', '#4299e1', '#9f7aea'];

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'daily':
        return 'Últimas 24 horas';
      case 'weekly':
        return 'Última semana';
      case 'monthly':
        return 'Último mes';
      case 'yearly':
        return 'Último año';
      default:
        return '';
    }
  };

  return (
    <div className="user-charts">
      {/* Header */}
      <div className="charts-header">
        <div>
          <h1>Estadísticas Financieras</h1>
          <p>Visualiza tus ingresos y gastos con gráficos detallados</p>
        </div>

        {/* Period Filter */}
        <div className="period-filter">
          <button
            className={`filter-btn ${filterPeriod === 'daily' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('daily')}
          >
            📅 Diario
          </button>
          <button
            className={`filter-btn ${filterPeriod === 'weekly' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('weekly')}
          >
            📅 Semanal
          </button>
          <button
            className={`filter-btn ${filterPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('monthly')}
          >
            📅 Mensual
          </button>
          <button
            className={`filter-btn ${filterPeriod === 'yearly' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('yearly')}
          >
            📅 Anual
          </button>
        </div>
      </div>

      {/* Current Period Label */}
      <div className="period-label">
        <span className="period-badge">{getPeriodLabel()}</span>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Ingresos</h3>
            <p className="card-amount">{formatCurrency(stats.totalIncome)}</p>
            <span className="card-count">{filteredData.incomes.length} transacciones</span>
          </div>
        </div>

        <div className="summary-card expense-card">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Gastos</h3>
            <p className="card-amount">{formatCurrency(stats.totalExpense)}</p>
            <span className="card-count">{filteredData.expenses.length} transacciones</span>
          </div>
        </div>

        <div className={`summary-card balance-card ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">{stats.balance >= 0 ? '📈' : '📉'}</div>
          <div className="card-content">
            <h3>Balance</h3>
            <p className="card-amount">{formatCurrency(stats.balance)}</p>
            <span className="card-count">{stats.balance >= 0 ? 'Superávit' : 'Déficit'}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Income by Category */}
        {stats.incomeByCategory.length > 0 ? (
          <div className="chart-card">
            <h3 className="chart-title">💰 Ingresos por Categoría</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={stats.incomeByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {stats.incomeByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="chart-card empty-chart">
            <h3 className="chart-title">💰 Ingresos por Categoría</h3>
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <p>No hay datos de ingresos para este período</p>
            </div>
          </div>
        )}

        {/* Expense by Category */}
        {stats.expenseByCategory.length > 0 ? (
          <div className="chart-card">
            <h3 className="chart-title">💸 Gastos por Categoría</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={stats.expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {stats.expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="chart-card empty-chart">
            <h3 className="chart-title">💸 Gastos por Categoría</h3>
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <p>No hay datos de gastos para este período</p>
            </div>
          </div>
        )}

        {/* Comparison Bar Chart */}
        <div className="chart-card full-width">
          <h3 className="chart-title">📊 Comparación Ingresos vs Gastos</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={[
                  { name: 'Ingresos', amount: stats.totalIncome },
                  { name: 'Gastos', amount: stats.totalExpense },
                  { name: 'Balance', amount: Math.abs(stats.balance) },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="name" stroke="#6c757d" />
                <YAxis stroke="#6c757d" />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ background: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#667eea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCharts;
