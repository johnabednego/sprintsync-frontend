import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import { useAuth } from './contexts/AuthContext';
import Projects from './pages/Projects';
import TaskList from './pages/TaskList';
import TagManagement from './pages/TagManagement';
import TimeEntryList from './pages/TimeEntry/TimeEntryList';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AuditLogManagement from './pages/AuditLogManagement';


export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/time-entries" element={<TimeEntryList />} />
      <Route path="/profile" element={<Profile />} />
      {user.isAdmin && (
        <>
          <Route path="/users" element={<UserManagement />} />
          <Route path="/tags" element={<TagManagement />} />
          <Route path="/audit-logs" element={<AuditLogManagement />} />
        </>
      )}
      {/* Redirect any unknown route to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
