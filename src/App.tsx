import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MyCVs } from './pages/MyCVs';
import { CreateCV } from './pages/CreateCV';
import { CVBuilder } from './pages/CVBuilder';
import { Templates } from './pages/Templates';
import { ATSAnalyzer } from './pages/ATSAnalyzer';
import { JobMatch } from './pages/JobMatch';
import { Settings } from './pages/Settings';
import { HelpSupport } from './pages/HelpSupport';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/my-cvs" element={<MyCVs />} /><Route path="/create-cv" element={<CreateCV />} /><Route path="/builder/:id" element={<CVBuilder />} /><Route path="/templates" element={<Templates />} /><Route path="/ats-analyzer" element={<ATSAnalyzer />} /><Route path="/job-match" element={<JobMatch />} /><Route path="/settings" element={<Settings />} /><Route path="/help" element={<HelpSupport />} /></Route>
            <Route element={<AdminRoute />}><Route path="/admin" element={<AdminDashboard />} /></Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
