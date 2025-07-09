import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MobileLayout from './components/MobileLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UsersPage from './pages/admin/UsersPage';
import TransactionsPage from './pages/admin/TransactionsPage';
import PurchasesPage from './pages/admin/PurchasesPage';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';
import WithdrawPage from './pages/admin/WithdrawPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RechargePage from './pages/RechargePage';
import ProductsPage from './pages/ProductsPage';
import RechargeLogPage from './pages/RechargeLogPage';
import WithdrawalLogPage from './pages/WithdrawalLogPage';
import WithdrawalPage from './pages/WithdrawalPage';
import LuckyDrawPage from './pages/LuckyDrawPage';
import ProfilePage from './pages/ProfilePage';
import SharePage from './pages/share';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage2';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
                    <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
          </Route>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="team"
              element={
                <ProtectedRoute>
                  <TeamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="recharge"
              element={
                <ProtectedRoute>
                  <RechargePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="recharge-log"
              element={
                <ProtectedRoute>
                  <RechargeLogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="withdrawal-log"
              element={
                <ProtectedRoute>
                  <WithdrawalLogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="withdrawal"
              element={
                <ProtectedRoute>
                  <WithdrawalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="lucky-draw"
              element={
                <ProtectedRoute>
                  <LuckyDrawPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="share"
              element={
                <ProtectedRoute>
                  <SharePage />
                </ProtectedRoute>
              }
            />
                        

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;