import { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../components/baseUrl';
import { toast } from 'react-toastify';
import { useTasks } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';

export default function TimeEntryDetail({ entry, onClose }) {
  const isNew = entry?.new;
  const tasks = useTasks();
  const users = useUsers();

  const [form, setForm] = useState({
    taskId:    '',
    userId:    '',
    minutes:   '',
    startTime: '',
    endTime:   '',
    notes:     ''
  });

  useEffect(() => {
    if (!isNew && entry) {
      setForm({
        taskId:    entry.task._id,
        userId:    entry.user._id,
        minutes:   entry.minutes,
        startTime: entry.startTime.slice(0,16),  // for input[type=datetime-local]
        endTime:   entry.endTime?.slice(0,16) || '',
        notes:     entry.notes || ''
      });
    }
  }, []);

  const save = async () => {
    const { taskId, userId, minutes, startTime, endTime, notes } = form;
    if (!taskId || !userId || !minutes || !startTime) {
      return toast.error('Task, user, minutes and start time are required');
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${baseUrl}/time-entries`,
        {
          taskId, userId,
          minutes: parseInt(minutes,10),
          startTime, endTime: endTime || null, notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Time entry saved');
      onClose();
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 overflow-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md m-4">
        <h2 className="text-xl font-semibold dark:text-gray-100 mb-4">
          {isNew ? 'New Time Entry' : 'Edit Time Entry'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 dark:text-gray-300">Task</label>
            <select
              value={form.taskId}
              onChange={e => setForm(f=>({...f, taskId:e.target.value}))}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">— Select Task —</option>
              {tasks.map(t=>(
                <option key={t._id} value={t._id}>{t.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 dark:text-gray-300">User</label>
            <select
              value={form.userId}
              onChange={e => setForm(f=>({...f, userId:e.target.value}))}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">— Select User —</option>
              {users.map(u=>(
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 dark:text-gray-300">Minutes</label>
              <input
                type="number"
                min="1"
                value={form.minutes}
                onChange={e => setForm(f=>({...f, minutes:e.target.value}))}
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 dark:text-gray-300">Start Time</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={e => setForm(f=>({...f, startTime:e.target.value}))}
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 dark:text-gray-300">End Time</label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={e => setForm(f=>({...f, endTime:e.target.value}))}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 dark:text-gray-300">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f=>({...f, notes:e.target.value}))}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
            Cancel
          </button>
          <button onClick={save} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
