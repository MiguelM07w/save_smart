import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { incomeApi, expenseApi } from '../../services/api.service';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, calculateProfits, groupByKey, sumByKey } from '../../utils/helpers';
import {
  exportExpensesToPDF,
  exportIncomesToPDF,
  exportStatisticsToPDF,
  exportExpensesToCSV,
  exportIncomesToCSV,
  exportStatisticsToCSV,
} from '../../utils/exportUtils';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import './styles/UserDashboard.css';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user's income and expenses
  const { data: allIncomes, isLoading: loadingIncomes } = useQuery({
    queryKey: ['incomes'],
    queryFn: incomeApi.getAll,
  });

  const { data: allExpenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseApi.getAll,
  });

  // Filter data for current user
  const userIncomes = useMemo(
    () => allIncomes?.filter((income) => income.iduser === user?._id) || [],
    [allIncomes, user]
  );

  const userExpenses = useMemo(
    () => allExpenses?.filter((expense) => expense.iduser === user?._id) || [],
    [allExpenses, user]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = sumByKey(userIncomes, 'amount');
    const totalExpense = sumByKey(userExpenses, 'amount');
    const profits = calculateProfits(totalIncome, totalExpense);

    // Group by category
    const incomeByCategory = Object.entries(groupByKey(userIncomes, 'category')).map(
      ([category, items]) => ({
        category,
        amount: sumByKey(items as any[], 'amount'),
      })
    );

    const expenseByCategory = Object.entries(groupByKey(userExpenses, 'category')).map(
      ([category, items]) => ({
        category,
        amount: sumByKey(items as any[], 'amount'),
      })
    );

    // Monthly trend (last 6 months)
    const monthlyData = calculateMonthlyTrend(userIncomes, userExpenses);

    return {
      totalIncome,
      totalExpense,
      profits,
      incomeByCategory,
      expenseByCategory,
      monthlyData,
    };
  }, [userIncomes, userExpenses]);

  // Export handlers
  const handleExportPDF = () => {
    exportStatisticsToPDF(
      {
        totalIncome: stats.totalIncome,
        totalExpense: stats.totalExpense,
        profits: stats.profits,
        incomeByCategory: stats.incomeByCategory,
        expenseByCategory: stats.expenseByCategory,
      },
      'Mis Estadísticas Financieras'
    );
  };

  const handleExportCSV = () => {
    exportStatisticsToCSV({
      totalIncome: stats.totalIncome,
      totalExpense: stats.totalExpense,
      profits: stats.profits,
      incomeByCategory: stats.incomeByCategory,
      expenseByCategory: stats.expenseByCategory,
    });
  };

  const handleExportExpensesPDF = () => {
    exportExpensesToPDF(userExpenses, 'Mis Gastos');
  };

  const handleExportExpensesCSV = () => {
    exportExpensesToCSV(userExpenses);
  };

  const handleExportIncomesPDF = () => {
    exportIncomesToPDF(userIncomes, 'Mis Ingresos');
  };

  const handleExportIncomesCSV = () => {
    exportIncomesToCSV(userIncomes);
  };

  if (loadingIncomes || loadingExpenses) {
    return <Loading />;
  }

  const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <div className="user-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Bienvenido, {user?.username}!</h1>
        <p>Aquí está tu resumen financiero personal</p>
      </div>

      {/* Export Buttons */}
      <div className="export-section card">
        <h3>Exportar Estadísticas</h3>
        <div className="export-buttons">
          <Button variant="primary" onClick={handleExportPDF}>
            📄 Descargar PDF Completo
          </Button>
          <Button variant="success" onClick={handleExportCSV}>
            📊 Descargar CSV Completo
          </Button>
          <Button variant="outline" onClick={handleExportExpensesPDF}>
            💸 PDF Gastos
          </Button>
          <Button variant="outline" onClick={handleExportExpensesCSV}>
            📈 CSV Gastos
          </Button>
          <Button variant="outline" onClick={handleExportIncomesPDF}>
            💰 PDF Ingresos
          </Button>
          <Button variant="outline" onClick={handleExportIncomesCSV}>
            📊 CSV Ingresos
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions card">
        <h3>Gestionar Transacciones</h3>
        <div className="action-cards">
          <div className="action-card" onClick={() => navigate('/user/income')}>
            <div className="action-icon income-action">💰</div>
            <h4>Mis Ingresos</h4>
            <p>{formatCurrency(stats.totalIncome)}</p>
            <span className="action-count">{userIncomes.length} registros</span>
          </div>
          <div className="action-card" onClick={() => navigate('/user/expenses')}>
            <div className="action-icon expense-action">💸</div>
            <h4>Mis Gastos</h4>
            <p>{formatCurrency(stats.totalExpense)}</p>
            <span className="action-count">{userExpenses.length} registros</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card income-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Ingresos</p>
            <h3 className="stat-value">{formatCurrency(stats.totalIncome)}</h3>
            <p className="stat-detail">{userIncomes.length} registros</p>
          </div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <p className="stat-label">Total Gastos</p>
            <h3 className="stat-value">{formatCurrency(stats.totalExpense)}</h3>
            <p className="stat-detail">{userExpenses.length} registros</p>
          </div>
        </div>

        <div className="stat-card profit-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Balance</p>
            <h3 className="stat-value" style={{ color: stats.profits >= 0 ? '#22c55e' : '#ef4444' }}>
              {formatCurrency(stats.profits)}
            </h3>
            <p className="stat-detail">
              {stats.profits >= 0 ? 'Superávit' : 'Déficit'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Expense by Category */}
        {stats.expenseByCategory.length > 0 && (
          <div className="card chart-container">
            <h3 className="card-title">Gastos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`}
                  outerRadius={100}
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
        )}

        {/* Income by Category */}
        {stats.incomeByCategory.length > 0 && (
          <div className="card chart-container">
            <h3 className="card-title">Ingresos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.incomeByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`}
                  outerRadius={100}
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
        )}

        {/* Monthly Trend */}
        <div className="card chart-container" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Tendencia Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" name="Ingresos" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Gastos" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Bar Chart */}
        <div className="card chart-container" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Comparación Ingresos vs Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Ingresos', amount: stats.totalIncome },
                { name: 'Gastos', amount: stats.totalExpense },
                { name: 'Balance', amount: stats.profits },
              ]}
            >
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

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="card">
          <h3 className="card-title">Últimos Gastos</h3>
          <div className="transaction-list">
            {userExpenses.slice(0, 5).map((expense) => (
              <div key={expense._id} className="transaction-item">
                <div>
                  <p className="transaction-title">{expense.title}</p>
                  <p className="transaction-category">{expense.category}</p>
                </div>
                <p className="transaction-amount expense">-{formatCurrency(expense.amount)}</p>
              </div>
            ))}
            {userExpenses.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No hay gastos registrados
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Últimos Ingresos</h3>
          <div className="transaction-list">
            {userIncomes.slice(0, 5).map((income) => (
              <div key={income._id} className="transaction-item">
                <div>
                  <p className="transaction-title">{income.title}</p>
                  <p className="transaction-category">{income.category}</p>
                </div>
                <p className="transaction-amount income">+{formatCurrency(income.amount)}</p>
              </div>
            ))}
            {userIncomes.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No hay ingresos registrados
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate monthly trend
const calculateMonthlyTrend = (incomes: any[], expenses: any[]) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - (5 - i) + 12) % 12;
    const year = currentMonth - (5 - i) < 0 ? currentYear - 1 : currentYear;
    return { month: months[monthIndex], monthIndex, year };
  });

  return last6Months.map(({ month, monthIndex, year }) => {
    const monthIncomes = incomes.filter((income) => {
      const date = new Date(income.date);
      return date.getMonth() === monthIndex && date.getFullYear() === year;
    });

    const monthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === monthIndex && date.getFullYear() === year;
    });

    return {
      month,
      income: sumByKey(monthIncomes, 'amount'),
      expense: sumByKey(monthExpenses, 'amount'),
    };
  });
};

export default UserDashboard;
