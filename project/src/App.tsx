import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MobileLayout from './components/MobileLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RechargePage from './pages/RechargePage';
import ProductsPage from './pages/ProductsPage';
import RechargeLogPage from './pages/RechargeLogPage';
import WithdrawalPage from './pages/WithdrawalPage';
import LuckyDrawPage from './pages/LuckyDrawPage';
import ProfilePage from './pages/ProfilePage';
import SharePage from './pages/share';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<HomePage />} />
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
              path="recharge-log"
              element={
                <ProtectedRoute>
                  <RechargeLogPage />
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