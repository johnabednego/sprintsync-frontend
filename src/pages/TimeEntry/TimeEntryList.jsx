import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import baseUrl from '../../components/baseUrl';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';
import TimeEntryDetail from './TimeEntryDetail';

export default function TimeEntryList() {
  const { user } = useAuth();
  const isAdmin = user.isAdmin;
  const tasks = useTasks();
  const users = useUsers();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  // filters
  const [fTask, setFTask] = useState('');
  const [fUser, setFUser] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${baseUrl}/time-entries`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...(fTask && { task: fTask }),
          ...(fUser && { user: fUser })
        }
      });
      setEntries(data);
    } catch {
      toast.error('Failed to load time entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [fTask, fUser]);

  const deleteEntry = async id => {
    if (!confirm('Delete this entry?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/time-entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Entry deleted');
      fetchEntries();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = useMemo(() => entries, [entries]);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <select
            value={fTask}
            onChange={e => setFTask(e.target.value)}
            className="px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Tasks</option>
            {tasks.map(t => (
              <option key={t._id} value={t._id}>{t.title}</option>
            ))}
          </select>
          <select
            value={fUser}
            onChange={e => setFUser(e.target.value)}
            className="px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Users</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={() => { setFTask(''); setFUser(''); }}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Reset Filters
          </button>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowDetail({ new: true })}
            className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-1"
          >
            <FaPlus /> New Entry
          </button>
        )}
      </div>

      {/* Table view for md+ screens */}
      <div className="hidden md:block overflow-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {['Task', 'User', 'Minutes', 'Start', 'End', 'Notes', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e._id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2 dark:text-gray-100">{e.task.title}</td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {e.user.firstName} {e.user.lastName}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">{e.minutes}</td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {new Date(e.startTime).toLocaleString()}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {e.endTime ? new Date(e.endTime).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">{e.notes || '–'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    title="View / Edit"
                    onClick={() => setShowDetail(e)}
                    className="p-1 text-blue-600 hover:text-blue-500"
                  ><FaEye /></button>
                  <button
                    onClick={() => deleteEntry(e._id)}
                    className="p-1 text-red-600 hover:text-red-500"
                  ><FaTrash /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for small screens */}
      <div className="space-y-4 md:hidden">
        {filtered.map(e => (
          <div key={e._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="flex justify-end space-x-2">
              <button
                title="View / Edit"
                onClick={() => setShowDetail(e)}
                className="text-blue-600 hover:text-blue-500"
              ><FaEye /></button>
              <button
                onClick={() => deleteEntry(e._id)}
                className="text-red-600 hover:text-red-500"
              ><FaTrash /></button>
            </div>

            <div className="flex flex-col gap-1 mt-2 dark:text-gray-200">
              <p><strong>Task:</strong> {e.task.title}</p>
              <p><strong>User:</strong> {e.user.firstName} {e.user.lastName}</p>
              <p><strong>Minutes:</strong> {e.minutes}</p>
              <p><strong>Start:</strong> {new Date(e.startTime).toLocaleString()}</p>
              <p><strong>End:</strong> {e.endTime ? new Date(e.endTime).toLocaleString() : '—'}</p>
              <p><strong>Notes:</strong> {e.notes || '–'}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No entries found.
        </p>
      )}

      {showDetail && (
        <TimeEntryDetail
          entry={showDetail}
          onClose={() => {
            setShowDetail(false);
            fetchEntries();
          }}
        />
      )}
    </div>
  );
}
