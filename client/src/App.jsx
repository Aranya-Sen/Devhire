import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import AdminLayout from './components/common/AdminLayout';
// Public
import Landing from './pages/Landing';

// Auth
import CandidateLogin from './pages/auth/CandidateLogin';
import CandidateRegister from './pages/auth/CandidateRegister';
import CompanyLogin from './pages/auth/CompanyLogin';
import CompanyRegister from './pages/auth/CompanyRegister';

// Candidate
import CandidateHome from './pages/candidate/CandidateHome';
import CandidateProfile from './pages/candidate/CandidateProfile';
import JobSearch from './pages/candidate/JobSearch';
import JobDetail from './pages/candidate/JobDetail';
import MyApplications from './pages/candidate/MyApplications';

// Company
import CompanyHome from './pages/company/CompanyHome';
import CompanyProfile from './pages/company/CompanyProfile';
import PostJob from './pages/company/PostJob';
import ManageJobs from './pages/company/ManageJobs';
import ViewApplications from './pages/company/ViewApplications';

// Admin — separate from main layout
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCandidates from './pages/admin/ManageCandidates';
import ManageCompanies from './pages/admin/ManageCompanies';
import AdminManageJobs from './pages/admin/ManageJobs';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
          <Route path="/candidate/login" element={<MainLayout><CandidateLogin /></MainLayout>} />
          <Route path="/candidate/register" element={<MainLayout><CandidateRegister /></MainLayout>} />
          <Route path="/company/login" element={<MainLayout><CompanyLogin /></MainLayout>} />
          <Route path="/company/register" element={<MainLayout><CompanyRegister /></MainLayout>} />

          {/* Candidate protected */}
          <Route path="/candidate/home" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <MainLayout><CandidateHome /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <MainLayout><CandidateProfile /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/jobs" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <MainLayout><JobSearch /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/jobs/:id" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <MainLayout><JobDetail /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/applications" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <MainLayout><MyApplications /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Company protected */}
          <Route path="/company/home" element={
            <ProtectedRoute allowedRoles={['company']}>
              <MainLayout><CompanyHome /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/profile" element={
            <ProtectedRoute allowedRoles={['company']}>
              <MainLayout><CompanyProfile /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/post-job" element={
            <ProtectedRoute allowedRoles={['company']}>
              <MainLayout><PostJob /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/jobs" element={
            <ProtectedRoute allowedRoles={['company']}>
              <MainLayout><ManageJobs /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/jobs/:jobId/applications" element={
            <ProtectedRoute allowedRoles={['company']}>
              <MainLayout><ViewApplications /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Admin — no Navbar, completely separate */}
          <Route path="/devhire-admin/login" element={<AdminLogin />} />
          <Route path="/devhire-admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/devhire-admin/candidates" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><ManageCandidates /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/devhire-admin/companies" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><ManageCompanies /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/devhire-admin/jobs" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminManageJobs /></AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;