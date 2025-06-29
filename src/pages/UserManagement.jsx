import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import baseUrl from '../components/baseUrl';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers]             = useState([]);
  const [pageCount, setPageCount]     = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [editUser, setEditUser]       = useState(null);
  const [form, setForm]               = useState({ firstName: '', lastName: '', isAdmin: false });
  const limit = 10;

  // Fetch users
  const fetchUsers = async (selected = 0) => {
    try {
      const page = selected + 1;
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${baseUrl}/users?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(data.data);
      setPageCount(Math.ceil(data.total / limit));
      setCurrentPage(selected);
    } catch {
      toast.error('Failed to load users');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Pagination
  const handlePageClick = ({ selected }) => {
    fetchUsers(selected);
  };

  // Edit modal controls
  const openEdit = u => {
    setEditUser(u);
    setForm({ firstName: u.firstName, lastName: u.lastName, isAdmin: u.isAdmin });
  };
  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${baseUrl}/users/${editUser._id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User updated');
      setEditUser(null);
      fetchUsers(currentPage);
    } catch {
      toast.error('Update failed');
    }
  };
  const deleteUser = async id => {
    if (!confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted');
      fetchUsers(currentPage);
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        User Management
      </h2>

      {/* Table view on md+ */}
      <div className="hidden md:block overflow-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Admin?</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2 dark:text-gray-100">
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">{u.email}</td>
                <td className="px-4 py-2 dark:text-gray-100">{u.isAdmin ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view on small */}
      <div className="md:hidden space-y-4">
        {users.map(u => (
          <div
            key={u._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col space-y-2"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold dark:text-gray-100">
                {u.firstName} {u.lastName}
              </h3>
              <span className="text-sm dark:text-gray-300">
                {u.isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            <p className="text-sm dark:text-gray-200">{u.email}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => openEdit(u)}
                className="flex-1 px-2 py-1 bg-yellow-500 text-white rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(u._id)}
                className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={'← Prev'}
        nextLabel={'Next →'}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        forcePage={currentPage}
        containerClassName="flex flex-wrap justify-center gap-2"
        pageClassName="px-3 py-1 border rounded dark:border-gray-600"
        activeClassName="bg-indigo-600 text-white"
        previousClassName="px-3 py-1"
        nextClassName="px-3 py-1"
        disabledClassName="opacity-50 cursor-not-allowed"
      />

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditUser(null)}
          />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm mx-2">
            <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">
              Edit User
            </h3>
            <div className="space-y-4">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleFormChange}
                placeholder="First Name"
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleFormChange}
                placeholder="Last Name"
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={form.isAdmin}
                  onChange={handleFormChange}
                  className="form-checkbox"
                />
                <span className="dark:text-gray-300">Admin?</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
