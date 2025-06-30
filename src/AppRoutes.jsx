import { Routes, Route, Navigate } from 'react-router-dom';
import Profile        from './pages/Profile';
import UserManagement from './pages/UserManagement';
import { useAuth }    from './contexts/AuthContext';
import Projects from './pages/Projects';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/projects" element={<Projects />} />
      <Route path="/profile" element={<Profile />} />
      {user.isAdmin && (
        <Route path="/users" element={<UserManagement />} />
      )}
      {/* Redirect any unknown route to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
