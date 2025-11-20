import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import UserHome from '../pages/user/UserHome';
import UserForms from '../pages/user/UserForms';
import UserCharts from '../pages/user/UserCharts';
import UserDashboard from '../pages/user/UserDashboard';
import UserLearn from '../features/learn/UserLearn';
import UserNews from '../features/news/UserNews';
import UserPayments from '../features/payments/UserPayments';
import UserProfile from '../pages/user/UserProfile';

const UserRoutes: React.FC = () => {
  return (
    <Route path="/user" element={<UserLayout />}>
      <Route index element={<Navigate to="/user/home" replace />} />
      <Route path="home" element={<UserHome />} />
      <Route path="forms" element={<UserForms />} />
      <Route path="charts" element={<UserCharts />} />
      <Route path="dashboard" element={<UserDashboard />} />
      <Route path="learn" element={<UserLearn />} />
      <Route path="news" element={<UserNews />} />
      <Route path="payments" element={<UserPayments />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="settings" element={<UserProfile />} />
    </Route>
  );
};

export default UserRoutes;
