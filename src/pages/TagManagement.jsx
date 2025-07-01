import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import baseUrl from '../components/baseUrl';

export default function TagManagement() {
  const [tags, setTags]           = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalTag, setModalTag]   = useState(null);
  const [form, setForm]           = useState({ name: '', color: '#CCCCCC', description: '' });
  const limit = 10;

  // fetch
  const fetchTags = async (pageIndex = 0) => {
    try {
      const page = pageIndex + 1;
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${baseUrl}/tags?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // backend should return { page, limit, total, data: [ tags ] }
      const items = data.data || data; 
      const total = data.total || items.length;
      setTags(items);
      setPageCount(Math.ceil(total / limit));
      setCurrentPage(pageIndex);
    } catch {
      toast.error('Failed to load tags');
    }
  };

  useEffect(() => { fetchTags(); }, []);

  // pagination
  const handlePageClick = ({ selected }) => fetchTags(selected);

  // open modal
  const openEdit = t => {
    if (t) setForm({ name: t.name, color: t.color, description: t.description });
    else  setForm({ name: '', color: '#CCCCCC', description: '' });
    setModalTag(t || { new: true });
  };

  // form change
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // save
  const save = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = modalTag.new
        ? `${baseUrl}/tags`
        : `${baseUrl}/tags/${modalTag._id}`;
      const method = modalTag.new ? 'post' : 'put';
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(modalTag.new ? 'Tag created' : 'Tag updated');
      setModalTag(null);
      fetchTags(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  // delete
  const del = async id => {
    if (!confirm('Delete this tag?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Tag deleted');
      fetchTags(currentPage);
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Tag Management
        </h2>
        <button
          onClick={() => openEdit(null)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + New Tag
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {['Name','Color','Description','Created By','Actions'].map(h => (
                <th key={h} className="px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tags.map(t => (
              <tr key={t._id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{t.name}</td>
                <td className="px-4 py-2">
                  <span
                    className="inline-block w-6 h-6 rounded border"
                    style={{ backgroundColor: t.color }}
                  />
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{t.description}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">
                  {t.createdBy?.firstName} {t.createdBy?.lastName}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1 text-yellow-500 hover:text-yellow-400"
                  ><FaEdit /></button>
                  <button
                    onClick={() => del(t._id)}
                    className="p-1 text-red-600 hover:text-red-500"
                  ><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={'← Previous'}
          nextLabel={'Next →'}
          pageCount={pageCount}
          forcePage={currentPage}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center space-x-1 mt-4"
          pageClassName="px-3 py-1 border rounded dark:border-gray-600"
          activeClassName="bg-indigo-600 text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}

      {/* Edit/Create Modal */}
      {modalTag && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setModalTag(null)}
          />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md mx-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {modalTag.new ? 'New Tag' : 'Edit Tag'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  Color (hex)
                </label>
                <input
                  name="color"
                  type="color"
                  value={form.color}
                  onChange={handleFormChange}
                  className="h-10 w-16 p-0 border-0 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setModalTag(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
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
