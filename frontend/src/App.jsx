import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyCoursesPage } from './pages/student/MyCoursesPage';
import { CourseDetailPage } from './pages/student/CourseDetailPage';
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage';
import { StudentQuizzesPage } from './pages/student/StudentQuizzesPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentAnalyticsPage } from './pages/student/StudentAnalyticsPage';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyCoursesPage } from './pages/faculty/FacultyCoursesPage';
import { FacultyGradingPage } from './pages/faculty/FacultyGradingPage';
import { FacultyAttendancePage } from './pages/faculty/FacultyAttendancePage';
import { FacultyAnalyticsPage } from './pages/faculty/FacultyAnalyticsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { CourseAuditPage } from './pages/admin/CourseAuditPage';
import { SystemAnalyticsPage } from './pages/admin/SystemAnalyticsPage';

// Shared Pages
import { ForumPage } from './pages/shared/ForumPage';
import { ProfilePage } from './pages/shared/ProfilePage';
import { NotFoundPage } from './pages/shared/NotFoundPage';

// Layout wrapper with Sidebar & Top Navbar
const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Root index redirector
const RootRedirector = () => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'faculty') return <Navigate to="/faculty" replace />;
  return <Navigate to="/student" replace />;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<RootRedirector />} />

              {/* Protected Authenticated Routes inside AppLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* Student Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <MyCoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                      <CourseDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/assignments"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentAssignmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/quizzes"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentQuizzesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/attendance"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentAttendancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentAnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Faculty Routes */}
                <Route
                  path="/faculty"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/courses"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyCoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/grading"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyGradingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/attendance"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyAttendancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/quizzes"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyCoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyAnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UserManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/courses"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <CourseAuditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SystemAnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Shared Multi-Role Pages */}
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/forum/:id" element={<ForumPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
