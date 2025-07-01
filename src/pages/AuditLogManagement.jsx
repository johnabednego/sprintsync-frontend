import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import baseUrl from '../components/baseUrl';
import { useAuth } from '../contexts/AuthContext';

export default function AuditLogManagement() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [detailLog, setDetailLog] = useState(null);
  const limit = 20;

  const fetchLogs = async (selected = 0) => {
    const page = selected + 1;
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(
        `${baseUrl}/audit-logs?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(data.data);
      setPageCount(Math.ceil(data.total / limit));
      setCurrentPage(selected);
    } catch {
      toast.error('Failed to load audit logs');
    }
  };

  useEffect(() => {
    if (!user.isAdmin) return;
    fetchLogs();
  }, [user.isAdmin]);

  const handlePageClick = ({ selected }) => fetchLogs(selected);

  if (!user.isAdmin) {
    return <p className="p-4 text-red-600">Access denied.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Audit Logs
      </h2>

      <div className="overflow-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {[
                'Timestamp',
                'User',
                'Action',
                'Entity',
                'Entity ID',
                'Details'
              ].map(h => (
                <th key={h} className="px-4 py-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2 dark:text-gray-100">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {log.user.firstName} {log.user.lastName}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {log.action}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {log.entity}
                </td>
                <td className="px-4 py-2 dark:text-gray-100">
                  {log.entityId || '—'}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    title="View details"
                    onClick={() => setDetailLog(log)}
                    className="p-1 text-blue-600 hover:text-blue-500"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={'← Prev'}
          nextLabel={'Next →'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          forcePage={currentPage}
          containerClassName="flex space-x-1 justify-center"
          pageClassName="px-3 py-1 border rounded dark:border-gray-600"
          activeClassName="bg-indigo-600 text-white"
          previousClassName="px-3 py-1"
          nextClassName="px-3 py-1"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}

      {/* Detail Modal */}
      {detailLog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDetailLog(null)}
          />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg mx-2 overflow-auto max-h-[80vh]">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Audit Entry Details
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <p>
                <strong>ID:</strong> {detailLog._id}
              </p>
              <p>
                <strong>User:</strong> {detailLog.user.firstName}{' '}
                {detailLog.user.lastName} ({detailLog.user.email})
              </p>
              <p>
                <strong>Action:</strong> {detailLog.action}
              </p>
              <p>
                <strong>Entity:</strong> {detailLog.entity}
              </p>
              <p>
                <strong>Entity ID:</strong>{' '}
                {detailLog.entityId || '—'}
              </p>
              <div>
                <strong>Before:</strong>
                <pre className="bg-gray-100 dark:bg-gray-700 rounded p-2 overflow-auto">
                  {JSON.stringify(detailLog.before, null, 2) || 'null'}
                </pre>
              </div>
              <div>
                <strong>After:</strong>
                <pre className="bg-gray-100 dark:bg-gray-700 rounded p-2 overflow-auto">
                  {JSON.stringify(detailLog.after, null, 2) || 'null'}
                </pre>
              </div>
              {detailLog.metadata && Object.keys(detailLog.metadata).length > 0 && (
                <div>
                  <strong>Metadata:</strong>
                  <pre className="bg-gray-100 dark:bg-gray-700 rounded p-2 overflow-auto">
                    {JSON.stringify(detailLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <button
              onClick={() => setDetailLog(null)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
