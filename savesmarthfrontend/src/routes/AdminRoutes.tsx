import React from 'react';
import { Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import IncomePage from '../features/income/IncomePage';
import ExpensePage from '../features/expense/ExpensePage';
import UsersPage from '../features/users/UsersPage';
import PaymentsPage from '../features/payments/PaymentsPage';
import AdminVideosPage from '../features/videos/AdminVideosPage';
import AdminArticlesPage from '../features/articles/AdminArticlesPage';

const AdminRoutes: React.FC = () => {
  return (
    <Route path="/admin" element={<DashboardLayout />}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="income" element={<IncomePage />} />
      <Route path="expenses" element={<ExpensePage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="videos" element={<AdminVideosPage />} />
      <Route path="articles" element={<AdminArticlesPage />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="settings" element={<AdminProfile />} />
    </Route>
  );
};

export default AdminRoutes;
