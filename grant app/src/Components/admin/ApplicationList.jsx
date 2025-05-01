import React, { useState } from 'react';

const ApplicationList = ({ 
  applications, 
  onSelectApplication, 
  onPageChange, 
  currentPage, 
  totalPages, 
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = () => {
    onPageChange(1, statusFilter, searchTerm);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    onPageChange(1, status, searchTerm);
  };

  return (
    <div className="application-list">
      <div className="search-filters">
        <input 
          type="text" 
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <select 
          value={statusFilter} 
          onChange={(e) => handleStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div>Loading applications...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Funding Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.firstName} {app.lastName}</td>
                <td>{app.email}</td>
                <td>${app.fundingAmount}</td>
                <td>{app.status}</td>
                <td>
                  <button onClick={() => onSelectApplication(app)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ApplicationList;