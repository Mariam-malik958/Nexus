import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { PaymentsPage } from './pages/payments/PaymentsPage'; // Added missing page
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected App Workspace Layout 
            Grouping all feature routes under a single DashboardLayout parent 
            prevents unnecessary re-renders of your navigation and sidebar.
          */}
          <Route element={<DashboardLayout />}>
            
            {/* Dashboard Sub-routes */}
            <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="/dashboard/investor" element={<InvestorDashboard />} />
            
            {/* Profile Sub-routes */}
            <Route path="/profile/entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="/profile/investor/:id" element={<InvestorProfile />} />
            
            {/* Global Features Sub-routes */}
            <Route path="/investors" element={<InvestorsPage />} />
            <Route path="/entrepreneurs" element={<EntrepreneursPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/payments" element={<PaymentsPage />} /> {/* Integrated Payments Vault */}
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            
            {/* Integrated Messaging Channels */}
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            
          </Route>
          
          {/* Default Root Fallback Directives */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;