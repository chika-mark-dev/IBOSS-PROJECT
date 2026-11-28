import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RequireAuth } from './auth/RequireAuth';
import { RequireAdmin } from './auth/RequiredAdmin';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExamSessionPage } from './pages/ExamSessionPage';
import { ResultPage } from './pages/ResultPage';
import { CreateExamPage } from './pages/CreateExamPage';
import { AdminExamPage } from './pages/AdminExamPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sessions/:id" element={<ExamSessionPage />} />
          <Route path="/sessions/:id/result" element={<ResultPage />} />

          <Route element={<RequireAdmin />}>
            <Route path="/admin/exams/new" element={<CreateExamPage />} />
            <Route path="/admin/exams/:id" element={<AdminExamPage />} />
          </Route>
        </Route>

        <Route path="/exams" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
