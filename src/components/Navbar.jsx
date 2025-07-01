import { useAuth }   from '../contexts/AuthContext';
import { useTheme }  from '../contexts/ThemeContext';
import { FaMoon, FaSun, FaUserCircle, FaBars } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const nav = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="
      fixed top-0 left-0 right-0 flex justify-between items-center p-4
      bg-gradient-to-r from-indigo-600 to-purple-600
      dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900
      text-white shadow-lg z-40
    ">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="block lg:hidden p-2 bg-white/20 rounded hover:bg-white/30 transition z-50"
        >
          <FaBars />
        </button>
        <div className="flex gap-1 items-center">
          <img src={logo} alt="Logo" className="w-6 h-6" />
          <h1 className="text-xl font-bold">SprintSync</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggle}
          className="p-2 bg-white/20 rounded hover:bg-white/30 transition"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="cursor-pointer"
          >
            <FaUserCircle className="w-8 h-8 text-white" />
          </button>
          {showDropdown && (
            <div className="
              absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg
              p-2 text-sm text-gray-700 dark:text-gray-200 z-50
            ">
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              <hr className="my-2 border-gray-200 dark:border-gray-700"/>
              <button
                onClick={() => nav('/profile')}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
