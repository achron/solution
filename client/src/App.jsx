import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SkeletonList } from './components/Skeleton';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Lazy load patient pages for code splitting
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard').then(m => ({ default: m.PatientDashboard })));
const SymptomChecker = lazy(() => import('./pages/patient/SymptomChecker').then(m => ({ default: m.SymptomChecker })));
const Appointments = lazy(() => import('./pages/patient/Appointments').then(m => ({ default: m.Appointments })));
const PatientReports = lazy(() => import('./pages/patient/PatientReports').then(m => ({ default: m.PatientReports })));
const PatientAnalyses = lazy(() => import('./pages/patient/PatientAnalyses').then(m => ({ default: m.PatientAnalyses })));
const PatientProfile = lazy(() => import('./pages/patient/PatientProfile').then(m => ({ default: m.PatientProfile })));

// Lazy load doctor pages for code splitting
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard').then(m => ({ default: m.DoctorDashboard })));
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments').then(m => ({ default: m.DoctorAppointments })));
const DoctorPatients = lazy(() => import('./pages/doctor/DoctorPatients').then(m => ({ default: m.DoctorPatients })));
const DoctorAIReports = lazy(() => import('./pages/doctor/DoctorAIReports').then(m => ({ default: m.DoctorAIReports })));

// Lazy load admin pages for code splitting
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments').then(m => ({ default: m.AdminAppointments })));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminAIAnalyses = lazy(() => import('./pages/admin/AdminAIAnalyses').then(m => ({ default: m.AdminAIAnalyses })));

// Loading fallback component
const PageLoader = () => (
  <div className="p-6">
    <SkeletonList count={3} />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/patient/dashboard" replace />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <PatientDashboard />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/symptom-checker"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <SymptomChecker />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Appointments />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/reports"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <PatientReports />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/analyses"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <PatientAnalyses />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/profile"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <PatientProfile />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <DoctorDashboard />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <DoctorAppointments />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <DoctorPatients />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/ai-reports"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <DoctorAIReports />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <AdminDashboard />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <AdminUsers />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <AdminAppointments />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <AdminAnalytics />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ai-analyses"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <AdminAIAnalyses />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

