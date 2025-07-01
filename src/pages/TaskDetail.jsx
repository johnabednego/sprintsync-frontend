import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import baseUrl from '../components/baseUrl';
import { toast } from 'react-toastify';
import { useProjects } from '../hooks/useProjects';
import { useUsers }    from '../hooks/useUsers';
import { useTags }     from '../hooks/useTags';

const STATUSES = ['todo', 'inProgress', 'done'];

export default function TaskDetail({ task, onClose }) {
  const isNew     = task?.new === true;
  const projects  = useProjects();
  const users     = useUsers();
  const tags      = useTags();

  // prepare tag dropdown options
  const tagOptions = tags.map(t => ({
    value: t._id,
    label: t.name,
    color: t.color
  }));

  const [form, setForm] = useState({
    title:       '',
    description: '',
    project:     '',
    assignedTo:  '',
    status:      STATUSES[0],
    tags:        []           // array of tag IDs
  });
  const [comments, setComments]      = useState([]);
  const [minutesToAdd, setMinutes]   = useState('');
  const [totalMinutes, setTotalMin]  = useState(task.totalMinutes || 0);
  const [hoursLogged, setHours]      = useState(((task.totalMinutes||0)/60).toFixed(2));

  useEffect(() => {
    if (!isNew && task) {
      setForm({
        title:       task.title,
        description: task.description,
        project:     task.project?._id    || '',
        assignedTo:  task.assignedTo?._id || '',
        status:      task.status,
        tags:        task.tags?.map(t => t._id) || []
      });
      setTotalMin(task.totalMinutes || 0);
      setHours(((task.totalMinutes||0)/60).toFixed(2));
      fetchComments();
    }
  }, []);

  const save = async () => {
    if (!form.project) return toast.error('Please select a project');
    try {
      const token = localStorage.getItem('token');
      const url   = isNew
        ? `${baseUrl}/tasks`
        : `${baseUrl}/tasks/${task._id}`;
      const method = isNew ? 'post' : 'put';
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(isNew ? 'Task created' : 'Task updated');
      onClose();
    } catch {
      toast.error('Save failed');
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${baseUrl}/comments/task/${task._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(data);
    } catch {
      toast.error('Comments load failed');
    }
  };

  const addComment = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const text  = e.target.text.value;
    try {
      await axios.post(
        `${baseUrl}/comments`,
        { taskId: task._id, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      e.target.reset();
      fetchComments();
    } catch {
      toast.error('Comment failed');
    }
  };

  const logTime = async () => {
    const mins = parseInt(minutesToAdd, 10);
    if (isNaN(mins) || mins < 0) {
      return toast.error('Enter a non‑negative number of minutes');
    }
    try {
      const token = localStorage.getItem('token');
      const { data: updated } = await axios.patch(
        `${baseUrl}/tasks/${task._id}/time`,
        { minutes: mins },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Added ${mins} min — Total now ${updated.totalMinutes} min`);
      setMinutes('');
      setTotalMin(updated.totalMinutes);
      setHours((updated.totalMinutes/60).toFixed(2));
    } catch {
      toast.error('Time log failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 overflow-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-2xl m-4">
        <h2 className="text-xl font-semibold dark:text-gray-100 mb-4">
          {isNew ? 'New Task' : 'Task Details'}
        </h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['title','description'].map(fld => (
            <div key={fld}>
              <label className="block mb-1 dark:text-gray-300">
                {fld.charAt(0).toUpperCase()+fld.slice(1)}
              </label>
              <input
                name={fld}
                value={form[fld]}
                onChange={e => setForm(f => ({ ...f, [fld]: e.target.value }))}
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 dark:text-gray-300">Project</label>
            <select
              name="project"
              value={form.project}
              onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
              className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">— Select a project —</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 dark:text-gray-300">Assign To</label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
              className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">— Unassigned —</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>

          {!isNew && (
            <div>
              <label className="block mb-1 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Tag multi‑select */}
        <div className="mt-4">
          <label className="block mb-1 dark:text-gray-300">Tags</label>
          <Select
            isMulti
            options={tagOptions}
            value={tagOptions.filter(o => form.tags.includes(o.value))}
            onChange={selected => {
              setForm(f => ({
                ...f,
                tags: selected.map(o => o.value)
              }));
            }}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Pick one or more tags…"
            styles={{
              multiValue: (base, { data }) => ({
                ...base,
                backgroundColor: data.color
              }),
              multiValueLabel: base => ({
                ...base,
                color: 'white'
              }),
              multiValueRemove: base => ({
                ...base,
                color: 'white',
                ':hover': { backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }
              })
            }}
          />
        </div>

        {/* Time logging */}
        {!isNew && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              min="0"
              placeholder="Minutes"
              value={minutesToAdd}
              onChange={e => setMinutes(e.target.value)}
              className="w-24 border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={logTime}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              Add Time
            </button>
            <span className="ml-auto text-gray-700 dark:text-gray-300">
              Total: {totalMinutes} min ({hoursLogged} h)
            </span>
          </div>
        )}

        {/* Save / Cancel */}
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
            Cancel
          </button>
          <button onClick={save} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
            Save
          </button>
        </div>

        {/* Comments */}
        {!isNew && (
          <section className="mt-8">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Comments</h3>
            <ul className="space-y-2 max-h-48 overflow-auto mb-4">
              {comments.map(c => (
                <li key={c._id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-700 dark:text-gray-200">{c.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    — {c.author.firstName} {c.author.lastName}, {new Date(c.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <form onSubmit={addComment} className="flex space-x-2">
              <input
                name="text"
                required
                placeholder="Add a comment…"
                className="flex-1 border dark:border-gray-700 rounded px-3 py-2"
              />
              <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
                Comment
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
