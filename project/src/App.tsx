import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import TawkChat from './components/TawkChat';
import MobileLayout from './components/MobileLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';


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
import CustomerService from './pages/CustomerService';
import CashLogPage from './pages/CashLogPage';
import NotificationsPage from './pages/NotificationsPage';
import DownloadPage from './pages/DownloadPage';
import AboutPage from './pages/AboutPage';
import UserTransactionHistoryPage from './pages/TransactionHistoryPage';

// Super Admin Imports
import SuperAdminLoginPage from './pages/superadmin/SuperAdminLoginPage';
import SuperAdminLayout from './components/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import ManageUsersPage from './pages/superadmin/ManageUsersPage';
import ManageAdminsPage from './pages/superadmin/ManageAdminsPage';
import ManageWithdrawalsPage from './pages/superadmin/ManageWithdrawalsPage';
import TransactionHistoryPage from './pages/superadmin/TransactionHistoryPage';
import SuperAdminRechargeLogPage from './pages/superadmin/RechargeLogPage';

function App() {
  return (
    <AuthProvider>
      <TawkChat />
      <Router>
        <Routes>
                    <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/super-admin-login" element={<SuperAdminLoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

          <Route path="/super-admin/*" element={<ProtectedRoute superAdminOnly><SuperAdminLayout /></ProtectedRoute>}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="admins" element={<ManageAdminsPage />} />
            <Route path="withdrawals" element={<ManageWithdrawalsPage />} />
            <Route path="transactions" element={<TransactionHistoryPage />} />
            <Route path="recharge-log" element={<SuperAdminRechargeLogPage />} />
          </Route>

          <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<ManageUsersPage />} />
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
            <Route
              path="CustomerService"
              element={
                <ProtectedRoute>
                  <CustomerService
                    group_link="YOUR_WHATSAPP_GROUP_LINK" 
                    admin_number="YOUR_ADMIN_WHATSAPP_NUMBER"
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="cash-log"
              element={
                <ProtectedRoute>
                  <CashLogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="download"
              element={
                <ProtectedRoute>
                  <DownloadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="about"
              element={
                <ProtectedRoute>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="transaction-history"
              element={
                <ProtectedRoute>
                  <UserTransactionHistoryPage />
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