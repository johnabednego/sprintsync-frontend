// src/pages/Projects.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import baseUrl from '../components/baseUrl';
import { toast } from 'react-toastify';

const STATUSES = ['planned', 'active', 'onHold', 'completed'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalProj, setModalProj] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', startDate: '', endDate: '', members: [], status: 'planned'
  });

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState(null); // 'name' | 'status' | 'dates'
  const [sortDir, setSortDir] = useState('asc');
  const limit = 10;

  // Fetch paginated data
  const fetchProjects = async (pageIndex = 0) => {
    try {
      const page = pageIndex + 1;
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${baseUrl}/projects?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(data.data || []);
      setPageCount(Math.ceil((data.total || 0) / limit));
      setCurrentPage(pageIndex);
    } catch {
      toast.error('Failed to load projects');
      setProjects([]);
      setPageCount(0);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handlePageClick = ({ selected }) => fetchProjects(selected);

  // Sorting handler
  const handleSort = key => {
    if (sortKey === key) {
      // toggle direction
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Apply filters + sorting
  const displayed = React.useMemo(() => {
    let arr = [...projects];

    // Filter by name
    if (filterName) {
      const fn = filterName.toLowerCase();
      arr = arr.filter(p =>
        p.name.toLowerCase().includes(fn)
      );
    }

    // Filter by status
    if (filterStatus) {
      arr = arr.filter(p => p.status === filterStatus);
    }

    // Sort
    if (sortKey) {
      arr.sort((a, b) => {
        let av, bv;
        if (sortKey === 'name') {
          av = a.name.toLowerCase();
          bv = b.name.toLowerCase();
        } else if (sortKey === 'status') {
          av = a.status;
          bv = b.status;
        } else if (sortKey === 'start date') {
          av = new Date(a.startDate);
          bv = new Date(b.startDate);
        } else if (sortKey === 'end date') {
          av = new Date(a.endDate);
          bv = new Date(b.endDate);
        }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return arr;
  }, [projects, filterName, filterStatus, sortKey, sortDir]);

  const handleResetFilters = () =>{
    setFilterName('')
    setFilterStatus('')
  }

  // Open create/edit modal
  const openModal = proj => {
    if (proj) {
      const { name, description, startDate, endDate, status } = proj;
      setForm({
        name,
        description,
        startDate: startDate?.slice(0, 10),
        endDate: endDate?.slice(0, 10) || '',
        members: proj.members?.map(m => m._id) || [],
        status
      });
      setModalProj(proj);
    } else {
      setForm({ name: '', description: '', startDate: '', endDate: '', members: [], status: 'planned' });
      setModalProj({ new: true });
    }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Save create/update
  const save = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = modalProj.new
        ? `${baseUrl}/projects`
        : `${baseUrl}/projects/${modalProj._id}`;
      const method = modalProj.new ? 'post' : 'put';
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(modalProj.new ? 'Project created' : 'Project updated');
      setModalProj(null);
      fetchProjects(currentPage);
    } catch {
      toast.error('Save failed');
    }
  };

  // Delete project
  const del = async id => {
    if (!confirm('Delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Project deleted');
      fetchProjects(currentPage);
    } catch {
      toast.error('Delete failed');
    }
  };

  // Inline status change
  const changeStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${baseUrl}/projects/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated');
      fetchProjects(currentPage);
    } catch {
      toast.error('Status change failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-0 lg:p-4 space-y-6">
      {/* Header & New */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold dark:text-gray-100">Projects</h2>
        <button
          onClick={() => openModal(null)}
          className="flex items-end justify-end self-end w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          + New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col  sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1 w-full min-w-0">
          <label className="block text-sm dark:text-gray-200 mb-1">Filter by Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </div>
        <div className="flex-1 w-full min-w-0">
          <label className="block text-sm dark:text-gray-200 mb-1">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button
          onClick={() => handleResetFilters()}
          className="flex items-end w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Reset
        </button>
      </div>

      {/* Table on md+ */}
      <div className="hidden md:block overflow-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {[
                { key: 'name', label: 'Name' },
                { key: 'status', label: 'Status' },
                { key: 'start date', label: 'Start Date' },
                { key: 'end date', label: 'End Date' },
              ].map(col => (
                <th
                  key={col.key}
                  className="px-4 py-2 cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center">
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    ) : (
                      <FaSort className="ml-1 opacity-50" />
                    )}
                  </div>
                </th>
              ))}
              <th className="flex items-start px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(p => (
              <tr key={p._id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2 dark:text-gray-100">{p.name}</td>
                <td className="px-4 py-2">
                  <select
                    value={p.status}
                    onChange={e => changeStatus(p._id, e.target.value)}
                    className="border dark:border-gray-600 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {new Date(p.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {new Date(p.endDate).toLocaleDateString()}
                </td>
                <td className="flex flex-wrap gap-2 px-4 py-2 space-x-2">
                  <button onClick={() => openModal(p)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => del(p._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view on sm */}
      <div className="md:hidden space-y-4">
        {displayed.map(p => (
          <div key={p._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold dark:text-gray-100">{p.name}</h3>
              <select
                value={p.status}
                onChange={e => changeStatus(p._id, e.target.value)}
                className="border dark:border-gray-600 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

            </div>
            <p className="text-sm dark:text-gray-200">
              {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
            </p>
            <div className="flex space-x-2">
              <button onClick={() => openModal(p)} className="flex-1 px-2 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
              <button onClick={() => del(p._id)} className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {displayed.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No projects match your filters.
        </p>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-4 flex justify-center">
          <ReactPaginate
            previousLabel={'← Prev'}
            nextLabel={'Next →'}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            containerClassName="flex flex-wrap gap-2"
            pageClassName="px-3 py-1 border rounded dark:border-gray-600"
            activeClassName="bg-indigo-600 text-white"
            previousClassName="px-3 py-1"
            nextClassName="px-3 py-1"
            disabledClassName="opacity-50"
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalProj && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalProj(null)} />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg mx-2">
            <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">
              {modalProj.new ? 'New Project' : 'Edit Project'}
            </h3>
            <div className="space-y-4">
              {['name', 'description', 'startDate', 'endDate'].map(field => (
                <div key={field}>
                  <label className="block text-gray-700 dark:text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    name={field}
                    type={field.includes('Date') ? 'date' : 'text'}
                    value={form[field]}
                    onChange={handleFormChange}
                    className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              ))}
              {!modalProj.new && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setModalProj(null)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
                <button onClick={save} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
