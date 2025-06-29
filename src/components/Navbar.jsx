import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun, FaUserCircle, FaBars } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.svg'

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg z-40">
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="block sm:hidden p-2 bg-white/20 rounded hover:bg-white/30 transition z-50"
        >
          <FaBars />
        </button>
        <div className='flex gap-1'>
        <img src={logo} alt="" width={25} height={25} />
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
            onClick={() => setShowDropdown(prev => !prev)}
            className="cursor-pointer"
          >
            <FaUserCircle className="w-8 h-8 text-white" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 dark:outline dark:outline-gray-700 rounded shadow-lg transition-all p-2 text-sm text-gray-700 dark:text-gray-200 z-50">
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <button
                onClick={() => {/* profile */}}
                className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
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
