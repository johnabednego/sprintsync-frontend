import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  FaEye,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import baseUrl from '../components/baseUrl';
import { useAuth } from '../contexts/AuthContext';
import TaskDetail from './TaskDetail';
import { useUsers } from '../hooks/useUsers';
import { useProjects } from '../hooks/useProjects';

const STATUSES = ['todo', 'inProgress', 'done'];

export default function TaskList() {
  const { user } = useAuth();
  const isAdmin = user.isAdmin;
  const users = useUsers();
  const projects = useProjects();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailTask, setDetail] = useState(null);

  // filters & sorting state
  const [filterTitle, setFilterTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [sortKey, setSortKey] = useState(null); // 'title','status','project','minutes'
  const [sortDir, setSortDir] = useState('asc');

  const fetchTasks = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const params = {};
      if (!isAdmin) params.assignedTo = user.sub;

      // We fetch unfiltered then apply client‑side filtering + sorting
      const res = await axios.get(`${baseUrl}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setTasks(res.data.data || []);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async id => {
    if (!confirm('Really delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Delete failed');
    }
  };

  // apply filters + sorting
  const displayed = useMemo(() => {
    let arr = [...tasks];

    if (filterTitle) {
      const ft = filterTitle.toLowerCase();
      arr = arr.filter(t => t.title.toLowerCase().includes(ft));
    }
    if (filterStatus) {
      arr = arr.filter(t => t.status === filterStatus);
    }
    if (filterProject) {
      arr = arr.filter(t => t.project?._id === filterProject);
    }

    if (sortKey) {
      arr.sort((a, b) => {
        let av, bv;
        switch (sortKey) {
          case 'title':
            av = a.title.toLowerCase(); bv = b.title.toLowerCase();
            break;
          case 'status':
            av = a.status; bv = b.status;
            break;
          case 'project':
            av = (a.project?.name || '').toLowerCase();
            bv = (b.project?.name || '').toLowerCase();
            break;
          case 'minutes':
            av = a.totalMinutes; bv = b.totalMinutes;
            break;
          default:
            return 0;
        }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return arr;
  }, [tasks, filterTitle, filterStatus, filterProject, sortKey, sortDir]);


  const handleResetFilters = () =>{
    setFilterTitle('')
    setFilterStatus('')
    setFilterProject('')
  }

  const handleSort = key => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };
  

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <div className='w-full flex flex-wrap gap-2 justify-between mb-4'>
         <button
          onClick={() => handleResetFilters()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Reset Filters
        </button>

        {/* Create button */}
        {isAdmin && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setDetail({ new: true })}
          >
            + Create Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Filter by title…"
          value={filterTitle}
          onChange={e => setFilterTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterProject}
          onChange={e => setFilterProject(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All projects</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Table view on md+ */}
      <div className="hidden md:block overflow-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {[
                { key: 'title', label: 'Title' },
                { key: 'project', label: 'Project' },
                { key: 'status', label: 'Status' },
                { key: 'minutes', label: 'Minutes' },
                { key: 'actions', label: 'Actions', sortable: false }
              ].map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-2 ${col.sortable === false ? '' : 'cursor-pointer select-none'}`}
                  onClick={col.sortable === false ? undefined : () => handleSort(col.key)}
                >
                  <div className="inline-flex items-center">
                    {col.label}
                    {col.sortable !== false && sortKey === col.key ? (
                      sortDir === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    ) : col.sortable !== false ? (
                      <FaSort className="ml-1 opacity-50" />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map(t => (
              <tr key={t._id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2 text-center dark:text-gray-100">
                  <div className='inline-block'>
                    {t.title}
                  </div>
                </td>
                <td className="px-4 py-2 text-center dark:text-gray-100">
                  <div className='inline-block'>
                    {t.project?.name || '—'}
                  </div>
                </td>
                <td className="px-4 py-2 text-center dark:text-gray-100">
                  <div className='inline-block capitalize'>
                    {t.status}
                  </div>
                </td>
                <td className="px-4 py-2 text-center dark:text-gray-100">
                  <div className='inline-block'>
                    {t.totalMinutes}
                  </div>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    title="View / Edit"
                    onClick={() => setDetail(t)}
                    className="p-1 text-blue-600 hover:text-blue-500"
                  ><FaEye /></button>
                  {isAdmin && (
                    <button
                      title="Delete"
                      onClick={() => deleteTask(t._id)}
                      className="p-1 text-red-600 hover:text-red-500"
                    ><FaTrash /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view on small */}
      <div className="space-y-4 md:hidden">
        {displayed.map(t => (
          <div key={t._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="flex justify-end space-x-2">
              <button
                title="View / Edit"
                onClick={() => setDetail(t)}
                className="text-blue-600 hover:text-blue-500"
              ><FaEye /></button>
              {isAdmin && (
                <button
                  title="Delete"
                  onClick={() => deleteTask(t._id)}
                  className="text-red-600 hover:text-red-500"
                ><FaTrash /></button>
              )}
            </div>

            <div className='flex flex-wrap gap-2 justify-between'>
              <div className='flex flex-col flex-wrap justify-between'>
                <p className="text-sm dark:text-gray-200">
                  <strong>Name:</strong> {t.title}
                </p>
                <p className="text-sm dark:text-gray-200">
                  <strong>Project:</strong> {t.project?.name || '—'}
                </p>
              </div>

              <div className='flex flex-col flex-wrap justify-between'>
                <p className="text-sm dark:text-gray-200">
                  <strong>Status:</strong> <span className='capitalize'>{t.status}</span>
                </p>
                <p className="text-sm dark:text-gray-200">
                  <strong>Minutes:</strong> {t.totalMinutes}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayed.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No tasks match your filters.
        </p>
      )}

      {/* Detail modal */}
      {detailTask && (
        <TaskDetail
          task={detailTask}
          users={users}
          onClose={() => {
            setDetail(null);
            fetchTasks();
          }}
        />
      )}
    </>
  );
}
