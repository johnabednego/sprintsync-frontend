// src/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard      from './pages/Dashboard';
// import Tasks          from './pages/Tasks';
// import Projects       from './pages/Projects';
// import Analytics      from './pages/Analytics';
import Profile        from './pages/Profile';
import UserManagement from './pages/UserManagement';
import { useAuth }    from './contexts/AuthContext';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* <Route path="/"        element={<Dashboard />} />
      <Route path="/tasks"   element={<Tasks />} />
      <Route path="/projects"element={<Projects />} />
      <Route path="/analytics"element={<Analytics />} /> */}
      <Route path="/profile" element={<Profile />} />
      {user.isAdmin && (
        <Route path="/users" element={<UserManagement />} />
      )}
      {/* Redirect any unknown route to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
