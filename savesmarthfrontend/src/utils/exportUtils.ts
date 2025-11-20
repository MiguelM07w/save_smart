import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parse } from 'papaparse';
import { formatDate, formatCurrency } from './helpers';

// ==================== PDF EXPORT ====================

export const exportToPDF = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  title: string,
  filename: string = 'export.pdf'
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Fecha de generación: ${formatDate(new Date())}`, 14, 32);

  // Prepare table data
  const tableData = data.map((item) =>
    columns.map((col) => {
      const value = item[col.dataKey];
      // Format values
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      if (value instanceof Date) {
        return formatDate(value);
      }
      return value?.toString() || '';
    })
  );

  // Add table
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Primary color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });

  // Save PDF
  doc.save(filename);
};

export const exportExpensesToPDF = (expenses: any[], title: string = 'Reporte de Gastos') => {
  const columns = [
    { header: 'Fecha', dataKey: 'date' },
    { header: 'Título', dataKey: 'title' },
    { header: 'Concepto', dataKey: 'concept' },
    { header: 'Monto', dataKey: 'amount' },
    { header: 'Categoría', dataKey: 'category' },
    { header: 'Fuente', dataKey: 'source' },
  ];

  const formattedData = expenses.map((expense) => ({
    ...expense,
    date: formatDate(expense.date),
    amount: formatCurrency(expense.amount),
  }));

  exportToPDF(formattedData, columns, title, `gastos-${Date.now()}.pdf`);
};

export const exportIncomesToPDF = (incomes: any[], title: string = 'Reporte de Ingresos') => {
  const columns = [
    { header: 'Fecha', dataKey: 'date' },
    { header: 'Título', dataKey: 'title' },
    { header: 'Concepto', dataKey: 'concept' },
    { header: 'Monto', dataKey: 'amount' },
    { header: 'Categoría', dataKey: 'category' },
    { header: 'Fuente', dataKey: 'source' },
  ];

  const formattedData = incomes.map((income) => ({
    ...income,
    date: formatDate(income.date),
    amount: formatCurrency(income.amount),
  }));

  exportToPDF(formattedData, columns, title, `ingresos-${Date.now()}.pdf`);
};

export const exportStatisticsToPDF = (
  stats: {
    totalIncome: number;
    totalExpense: number;
    profits: number;
    incomeByCategory: any[];
    expenseByCategory: any[];
  },
  title: string = 'Estadísticas Financieras'
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text(title, 14, 22);

  // Date
  doc.setFontSize(11);
  doc.text(`Fecha: ${formatDate(new Date())}`, 14, 32);

  // Summary
  doc.setFontSize(14);
  doc.text('Resumen Financiero', 14, 45);

  doc.setFontSize(12);
  doc.text(`Total Ingresos: ${formatCurrency(stats.totalIncome)}`, 14, 55);
  doc.text(`Total Gastos: ${formatCurrency(stats.totalExpense)}`, 14, 65);
  doc.text(`Ganancias: ${formatCurrency(stats.profits)}`, 14, 75);

  // Income by Category
  if (stats.incomeByCategory.length > 0) {
    doc.setFontSize(14);
    doc.text('Ingresos por Categoría', 14, 90);

    autoTable(doc, {
      head: [['Categoría', 'Monto']],
      body: stats.incomeByCategory.map((item) => [
        item.category,
        formatCurrency(item.amount),
      ]),
      startY: 95,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
    });
  }

  // Expense by Category
  if (stats.expenseByCategory.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 95;

    doc.setFontSize(14);
    doc.text('Gastos por Categoría', 14, finalY + 15);

    autoTable(doc, {
      head: [['Categoría', 'Monto']],
      body: stats.expenseByCategory.map((item) => [
        item.category,
        formatCurrency(item.amount),
      ]),
      startY: finalY + 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [239, 68, 68] },
    });
  }

  doc.save(`estadisticas-${Date.now()}.pdf`);
};

// ==================== CSV EXPORT ====================

export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
  // Convert data to CSV format
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes
          const stringValue = value?.toString() || '';
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportExpensesToCSV = (expenses: any[]) => {
  const formattedData = expenses.map((expense) => ({
    Fecha: formatDate(expense.date),
    Título: expense.title,
    Concepto: expense.concept,
    Monto: expense.amount,
    Categoría: expense.category,
    Fuente: expense.source,
    Notas: expense.notes,
  }));

  exportToCSV(formattedData, `gastos-${Date.now()}.csv`);
};

export const exportIncomesToCSV = (incomes: any[]) => {
  const formattedData = incomes.map((income) => ({
    Fecha: formatDate(income.date),
    Título: income.title,
    Concepto: income.concept,
    Monto: income.amount,
    Categoría: income.category,
    Fuente: income.source,
    Notas: income.notes,
  }));

  exportToCSV(formattedData, `ingresos-${Date.now()}.csv`);
};

export const exportStatisticsToCSV = (
  stats: {
    totalIncome: number;
    totalExpense: number;
    profits: number;
    incomeByCategory: any[];
    expenseByCategory: any[];
  }
) => {
  const summaryData = [
    { Concepto: 'Total Ingresos', Valor: stats.totalIncome },
    { Concepto: 'Total Gastos', Valor: stats.totalExpense },
    { Concepto: 'Ganancias', Valor: stats.profits },
  ];

  const categoriesData = [
    ...stats.incomeByCategory.map((item) => ({
      Tipo: 'Ingreso',
      Categoría: item.category,
      Monto: item.amount,
    })),
    ...stats.expenseByCategory.map((item) => ({
      Tipo: 'Gasto',
      Categoría: item.category,
      Monto: item.amount,
    })),
  ];

  // Combine both datasets
  exportToCSV([...summaryData, {}, ...categoriesData], `estadisticas-${Date.now()}.csv`);
};

// Export all functions
export default {
  exportToPDF,
  exportToCSV,
  exportExpensesToPDF,
  exportIncomesToPDF,
  exportExpensesToCSV,
  exportIncomesToCSV,
  exportStatisticsToPDF,
  exportStatisticsToCSV,
};
