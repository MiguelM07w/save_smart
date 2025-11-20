import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { incomeApi, expenseApi } from '../../services/api.service';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, sumByKey, groupByKey } from '../../utils/helpers';
import {
  exportStatisticsToPDF,
  exportStatisticsToCSV,
} from '../../utils/exportUtils';
import './styles/UserStats.css';

type FilterPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const UserStats: React.FC = () => {
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
    let startDate: Date;

    switch (filterPeriod) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredIncomes = userIncomes.filter(
      (income) => new Date(income.date) >= startDate
    );
    const filteredExpenses = userExpenses.filter(
      (expense) => new Date(expense.date) >= startDate
    );

    return { filteredIncomes, filteredExpenses };
  }, [userIncomes, userExpenses, filterPeriod]);

  // Calculate statistics
  const stats = useMemo(() => {
    const { filteredIncomes, filteredExpenses } = filteredData;

    const totalIncome = sumByKey(filteredIncomes, 'amount');
    const totalExpense = sumByKey(filteredExpenses, 'amount');
    const balance = totalIncome - totalExpense;

    // Group by category
    const incomeByCategory = Object.entries(
      groupByKey(filteredIncomes, 'category')
    ).map(([category, items]) => ({
      category,
      amount: sumByKey(items as any[], 'amount'),
    }));

    const expenseByCategory = Object.entries(
      groupByKey(filteredExpenses, 'category')
    ).map(([category, items]) => ({
      category,
      amount: sumByKey(items as any[], 'amount'),
    }));

    // Trend data based on filter
    const trendData = calculateTrendData(filteredIncomes, filteredExpenses, filterPeriod);

    return {
      totalIncome,
      totalExpense,
      balance,
      incomeByCategory,
      expenseByCategory,
      trendData,
    };
  }, [filteredData, filterPeriod]);

  // Export handlers
  const handleExportPDF = () => {
    exportStatisticsToPDF(
      {
        totalIncome: stats.totalIncome,
        totalExpense: stats.totalExpense,
        profits: stats.balance,
        incomeByCategory: stats.incomeByCategory,
        expenseByCategory: stats.expenseByCategory,
      },
      `Estadísticas ${getPeriodLabel(filterPeriod)}`
    );
  };

  const handleExportCSV = () => {
    exportStatisticsToCSV({
      totalIncome: stats.totalIncome,
      totalExpense: stats.totalExpense,
      profits: stats.balance,
      incomeByCategory: stats.incomeByCategory,
      expenseByCategory: stats.expenseByCategory,
    });
  };

  const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#ec4899', '#f59e0b', '#06b6d4'];

  return (
    <div className="user-stats">
      {/* Header with Filters */}
      <div className="stats-header">
        <div>
          <h1>📊 Estadísticas Financieras</h1>
          <p>Analiza tus ingresos y gastos por período</p>
        </div>
      </div>

      {/* Period Filters */}
      <div className="period-filters">
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
          📆 Semanal
        </button>
        <button
          className={`filter-btn ${filterPeriod === 'monthly' ? 'active' : ''}`}
          onClick={() => setFilterPeriod('monthly')}
        >
          📊 Mensual
        </button>
        <button
          className={`filter-btn ${filterPeriod === 'yearly' ? 'active' : ''}`}
          onClick={() => setFilterPeriod('yearly')}
        >
          📈 Anual
        </button>
      </div>

      {/* Export Buttons */}
      <div className="export-actions">
        <button className="export-btn pdf-btn" onClick={handleExportPDF}>
          📄 Descargar PDF
        </button>
        <button className="export-btn csv-btn" onClick={handleExportCSV}>
          📊 Descargar CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="summary-stat income-stat">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Ingresos</h3>
            <p className="stat-value">{formatCurrency(stats.totalIncome)}</p>
            <span className="stat-period">{getPeriodLabel(filterPeriod)}</span>
          </div>
        </div>

        <div className="summary-stat expense-stat">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Gastos</h3>
            <p className="stat-value">{formatCurrency(stats.totalExpense)}</p>
            <span className="stat-period">{getPeriodLabel(filterPeriod)}</span>
          </div>
        </div>

        <div className={`summary-stat balance-stat ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-icon">{stats.balance >= 0 ? '📈' : '📉'}</div>
          <div className="stat-content">
            <h3>Balance</h3>
            <p className="stat-value">{formatCurrency(stats.balance)}</p>
            <span className="stat-period">{stats.balance >= 0 ? 'Superávit' : 'Déficit'}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Trend Chart */}
        <div className="chart-card full-width">
          <h3>📈 Tendencia de {getPeriodLabel(filterPeriod)}</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
              <XAxis dataKey="label" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  background: 'rgba(30, 30, 46, 0.95)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#f9fafb',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                name="Ingresos"
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ec4899"
                strokeWidth={3}
                name="Gastos"
                dot={{ fill: '#ec4899', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Income by Category */}
        {stats.incomeByCategory.length > 0 && (
          <div className="chart-card">
            <h3>💰 Ingresos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.incomeByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) =>
                    `${category}: ${formatCurrency(amount)}`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {stats.incomeByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    background: 'rgba(30, 30, 46, 0.95)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#f9fafb',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expense by Category */}
        {stats.expenseByCategory.length > 0 && (
          <div className="chart-card">
            <h3>💸 Gastos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) =>
                    `${category}: ${formatCurrency(amount)}`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {stats.expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    background: 'rgba(30, 30, 46, 0.95)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#f9fafb',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Comparison Bar Chart */}
        <div className="chart-card full-width">
          <h3>📊 Comparación Ingresos vs Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Ingresos', amount: stats.totalIncome, fill: '#10b981' },
                { name: 'Gastos', amount: stats.totalExpense, fill: '#ec4899' },
                { name: 'Balance', amount: Math.abs(stats.balance), fill: stats.balance >= 0 ? '#3b82f6' : '#ef4444' },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  background: 'rgba(30, 30, 46, 0.95)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#f9fafb',
                }}
              />
              <Legend />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {[0, 1, 2].map((index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Details */}
      <div className="category-details">
        {stats.incomeByCategory.length > 0 && (
          <div className="category-section">
            <h3>💰 Desglose de Ingresos</h3>
            <div className="category-list">
              {stats.incomeByCategory.map((item, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span
                      className="category-dot"
                      style={{ background: COLORS[index % COLORS.length] }}
                    />
                    <span className="category-name">{item.category}</span>
                  </div>
                  <span className="category-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.expenseByCategory.length > 0 && (
          <div className="category-section">
            <h3>💸 Desglose de Gastos</h3>
            <div className="category-list">
              {stats.expenseByCategory.map((item, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span
                      className="category-dot"
                      style={{ background: COLORS[index % COLORS.length] }}
                    />
                    <span className="category-name">{item.category}</span>
                  </div>
                  <span className="category-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get period label
const getPeriodLabel = (period: FilterPeriod): string => {
  const labels = {
    daily: 'Hoy',
    weekly: 'Esta Semana',
    monthly: 'Este Mes',
    yearly: 'Este Año',
  };
  return labels[period];
};

// Helper function to calculate trend data
const calculateTrendData = (
  incomes: any[],
  expenses: any[],
  period: FilterPeriod
) => {
  const now = new Date();

  switch (period) {
    case 'daily':
      // Last 24 hours by hour
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const hourIncomes = incomes.filter((income) => {
          const date = new Date(income.date);
          return date.getHours() === hour;
        });
        const hourExpenses = expenses.filter((expense) => {
          const date = new Date(expense.date);
          return date.getHours() === hour;
        });
        return {
          label: `${hour}:00`,
          income: sumByKey(hourIncomes, 'amount'),
          expense: sumByKey(hourExpenses, 'amount'),
        };
      });

    case 'weekly':
      // Last 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayIncomes = incomes.filter((income) => {
          const incomeDate = new Date(income.date);
          return incomeDate.toDateString() === date.toDateString();
        });
        const dayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.toDateString() === date.toDateString();
        });
        return {
          label: date.toLocaleDateString('es-ES', { weekday: 'short' }),
          income: sumByKey(dayIncomes, 'amount'),
          expense: sumByKey(dayExpenses, 'amount'),
        };
      });

    case 'monthly':
      // Days of current month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayIncomes = incomes.filter((income) => {
          const date = new Date(income.date);
          return date.getDate() === day;
        });
        const dayExpenses = expenses.filter((expense) => {
          const date = new Date(expense.date);
          return date.getDate() === day;
        });
        return {
          label: `${day}`,
          income: sumByKey(dayIncomes, 'amount'),
          expense: sumByKey(dayExpenses, 'amount'),
        };
      });

    case 'yearly':
      // 12 months
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months.map((month, index) => {
        const monthIncomes = incomes.filter((income) => {
          const date = new Date(income.date);
          return date.getMonth() === index;
        });
        const monthExpenses = expenses.filter((expense) => {
          const date = new Date(expense.date);
          return date.getMonth() === index;
        });
        return {
          label: month,
          income: sumByKey(monthIncomes, 'amount'),
          expense: sumByKey(monthExpenses, 'amount'),
        };
      });

    default:
      return [];
  }
};

export default UserStats;
