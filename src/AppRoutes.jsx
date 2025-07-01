import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import { useAuth } from './contexts/AuthContext';
import Projects from './pages/Projects';
import TaskList from './pages/TaskList';
import TagManagement from './pages/TagManagement';
import TimeEntryList from './pages/TimeEntry/TimeEntryList';


export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="//time-entries" element={<TimeEntryList />} />
      <Route path="/profile" element={<Profile />} />
      {user.isAdmin && (
        <Route path="/users" element={<UserManagement />} />
      )}
      {user.isAdmin && <Route path="/tags" element={<TagManagement />} />}
      {/* Redirect any unknown route to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
