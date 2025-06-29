// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../components/baseUrl';
import { useAuth } from '../contexts/AuthContext';
import { toast }   from 'react-toastify';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState({
    avatarUrl: '',
    phoneNumber: '',
    address: { country: '', city: '' },
    preferences: { theme: 'light', timezone: 'UTC', itemsPerPage: 20 },
    emailOnAssignment: true,
    emailOnComment:    true,
    pushOnDailySummary:false
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword:     ''
  });

  // Initialize form
  useEffect(() => {
    if (!user) return;
    setProfile({
      avatarUrl: user.avatarUrl || '',
      phoneNumber: user.phoneNumber || '',
      address: {
        country: user.address.country || '',
        city:    user.address.city    || ''
      },
      preferences: {
        theme:        user.preferences.theme,
        timezone:     user.preferences.timezone,
        itemsPerPage: user.preferences.itemsPerPage
      },
      emailOnAssignment: user.emailOnAssignment,
      emailOnComment:    user.emailOnComment,
      pushOnDailySummary:user.pushOnDailySummary
    });
  }, [user]);

  // Handle changes
  const handleProfileChange = e => {
    const { name, value, type, checked } = e.target;

    if (name === 'country' || name === 'city') {
      setProfile(p => ({
        ...p,
        address: { ...p.address, [name]: value }
      }));
    } else if (['theme','timezone','itemsPerPage'].includes(name)) {
      setProfile(p => ({
        ...p,
        preferences: {
          ...p.preferences,
          [name]: name === 'itemsPerPage' ? Number(value) : value
        }
      }));
    } else if (
      ['emailOnAssignment','emailOnComment','pushOnDailySummary'].includes(name)
    ) {
      setProfile(p => ({ ...p, [name]: checked }));
    } else {
      setProfile(p => ({ ...p, [name]: value }));
    }
  };

  // Save profile
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.patch(
        `${baseUrl}/users/me`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${baseUrl}/users/me/change-password`,
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswords({ currentPassword: '', newPassword: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Form */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          My Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Avatar URL
            </label>
            <input
              name="avatarUrl"
              value={profile.avatarUrl}
              onChange={handleProfileChange}
              className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleProfileChange}
              className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Country
              </label>
              <input
                name="country"
                value={profile.address.country}
                onChange={handleProfileChange}
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                City
              </label>
              <input
                name="city"
                value={profile.address.city}
                onChange={handleProfileChange}
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <select
                name="theme"
                value={profile.preferences.theme}
                onChange={handleProfileChange}
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Timezone
              </label>
              <input
                name="timezone"
                value={profile.preferences.timezone}
                onChange={handleProfileChange}
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Items / page
              </label>
              <input
                type="number"
                name="itemsPerPage"
                value={profile.preferences.itemsPerPage}
                onChange={handleProfileChange}
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          {/* Notifications */}
          <div className="space-y-2">
            {[
              ['emailOnAssignment', 'Email on assignment'],
              ['emailOnComment',    'Email on comment'],
              ['pushOnDailySummary','Push daily summary']
            ].map(([name, label]) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={profile[name]}
                  onChange={handleProfileChange}
                  className="form-checkbox"
                />
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={saveProfile}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>
      </section>

      {/* Change Password Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
              className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
              className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={changePassword}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Update Password
          </button>
        </div>
      </section>
    </div>
  );
}
