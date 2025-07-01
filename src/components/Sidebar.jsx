// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaTasks,
  FaProjectDiagram,
  FaChartBar,
  FaUsers,
  FaTags
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const nav = [
    { to: '/',         label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/tasks',    label: 'Tasks',     icon: <FaTasks /> },
    { to: '/projects', label: 'Projects',  icon: <FaProjectDiagram /> },
    { to: '/analytics',label: 'Analytics', icon: <FaChartBar /> },
    // only show to admins:
    ...(user.isAdmin
      ? [
          { to: '/users', label: 'User Management', icon: <FaUsers /> },
          { to: '/tags',  label: 'Tag Management',  icon: <FaTags  /> }
        ]
      : []
    )
  ];

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-52 lg:w-64 bg-white dark:bg-gray-900 overflow-auto
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-200 ease-in-out
          sm:translate-x-0
        `}
        style={{ zIndex: 30 }}
      >
        <nav className="mt-6">
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-2 rounded-lg ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
              onClick={onClose}
            >
              <span className="mr-3">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
