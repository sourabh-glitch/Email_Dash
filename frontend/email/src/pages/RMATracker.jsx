import React, { useEffect, useState } from 'react';

import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';

const RMATracker = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const baseUrl = import.meta.env.VITE_API_URL;
  const tickUrl = import.meta.env.VITE_TICKET_URL;

  const PRIORITY_MAP = {
    1: { label: 'Low', color: 'text-green-600' },
    2: { label: 'Medium', color: 'text-yellow-600' },
    3: { label: 'High', color: 'text-orange-600' },
    4: { label: 'Urgent', color: 'text-red-600' },
  };

  const STATUS_MAP = {
    2: 'Open',
    3: 'Pending',
    4: 'Resolved',
    5: 'Closed',
    6: 'Waiting on Customer',
    7: 'Waiting on Third Party',
  };

  useEffect(() => {
    const fetchRmaTickets = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/tickets/RMA`);
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching RMA tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRmaTickets();
    const interval = setInterval(fetchRmaTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredTickets = tickets
    .filter((ticket) =>
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requester_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_id?.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      return sortOrder === 'asc'
        ? a.priority - b.priority
        : b.priority - a.priority;
    });
const rowsPerPage = 10;
  const {
    currentData,
    currentPage,
    maxPage,
    nextPage,
    prevPage,
    goToPage
  } = usePagination(filteredTickets, rowsPerPage);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="p-6 h-screen overflow-auto bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">RMA Tracker</h2>

      <input
        type="text"
        placeholder="Search by subject, email, or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring focus:border-blue-300"
      />

      {loading ? (
        <p className="text-gray-600">Loading RMA tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <p className="text-gray-600">No RMA tickets found matching your criteria.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">S.No</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                <th
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                  onClick={toggleSort}
                >
                  Priority {sortOrder === 'asc' ? '↑' : '↓'}
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Updated</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((ticket, index) => (
                <tr
                  key={`${ticket.ticket_id}-${index}`}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-sm text-gray-800">
      {(currentPage - 1) * rowsPerPage + index + 1}
    </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{ticket.ticket_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{ticket.subject}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{ticket.requester_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {STATUS_MAP[ticket.status] || (
                      <span className="text-red-500 italic">Unknown</span>
                    )}
                  </td>
                  <td className={`px-4 py-2 text-sm font-medium ${PRIORITY_MAP[ticket.priority]?.color || 'text-gray-600'}`}>
                    {PRIORITY_MAP[ticket.priority]?.label || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {formatDate(ticket.created_at)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {formatDate(ticket.updated_at)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    <a
                      href={`${tickUrl}${ticket.ticket_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            maxPage={maxPage}
            onNext={nextPage}
            onPrev={prevPage}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default RMATracker;
