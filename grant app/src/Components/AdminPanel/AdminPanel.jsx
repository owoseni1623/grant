import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, Clock, 
  ArrowLeft, ArrowRight, RefreshCw, FileText, Download, 
  User, Briefcase, Home, DollarSign, AlertCircle
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [filters, setFilters] = useState({
    status: '',
    fundingType: '',
    searchTerm: ''
  });
  const [sorting, setSorting] = useState({
    field: 'createdAt',
    direction: 'desc'
  });

  const applicationsPerPage = 10;

  // Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/applications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        setApplications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Fetch single application details
  const fetchApplicationDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch application details');
      }

      const data = await response.json();
      setSelectedApplication(data);
      setViewMode('detail');
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      const updatedApp = await response.json();
      
      // Update in the list
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status: status } : app
      ));
      
      // Update selected application if we're viewing it
      if (selectedApplication && selectedApplication._id === id) {
        setSelectedApplication({
          ...selectedApplication,
          status: status,
          statusHistory: [
            ...(selectedApplication.statusHistory || []),
            { status, changedAt: new Date() }
          ]
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Status filter
    if (filters.status && app.status !== filters.status) {
      return false;
    }
    
    // Funding type filter
    if (filters.fundingType && app.fundingInfo.fundingType !== filters.fundingType) {
      return false;
    }
    
    // Search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        app.personalInfo.firstName.toLowerCase().includes(searchLower) ||
        app.personalInfo.lastName.toLowerCase().includes(searchLower) ||
        app.personalInfo.email.toLowerCase().includes(searchLower) ||
        (app.addressInfo.city && app.addressInfo.city.toLowerCase().includes(searchLower)) ||
        (app.fundingInfo.fundingPurpose && app.fundingInfo.fundingPurpose.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let fieldA, fieldB;
    
    // Handle nested fields
    if (sorting.field === 'name') {
      fieldA = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase();
      fieldB = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`.toLowerCase();
    } else if (sorting.field === 'fundingAmount') {
      fieldA = a.fundingInfo.fundingAmount;
      fieldB = b.fundingInfo.fundingAmount;
    } else if (sorting.field === 'fundingType') {
      fieldA = a.fundingInfo.fundingType;
      fieldB = b.fundingInfo.fundingType;
    } else {
      fieldA = a[sorting.field];
      fieldB = b[sorting.field];
    }
    
    if (sorting.direction === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = sortedApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(sortedApplications.length / applicationsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-badge pending"><Clock size={16} /> Pending</span>;
      case 'APPROVED':
        return <span className="status-badge approved"><CheckCircle size={16} /> Approved</span>;
      case 'REJECTED':
        return <span className="status-badge rejected"><XCircle size={16} /> Rejected</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sorting
  const handleSort = (field) => {
    setSorting({
      field,
      direction: sorting.field === field && sorting.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Handle search
  const handleSearch = (e) => {
    handleFilterChange('searchTerm', e.target.value);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      fundingType: '',
      searchTerm: ''
    });
    setSorting({
      field: 'createdAt',
      direction: 'desc'
    });
    setCurrentPage(1);
  };

  // Go back to list view
  const backToList = () => {
    setViewMode('list');
    setSelectedApplication(null);
  };

  // Get unique funding types for filter
  const fundingTypes = [...new Set(applications.map(app => app.fundingInfo.fundingType))];

  if (loading && !applications.length) {
    return (
      <div className="admin-loading">
        <RefreshCw className="spin" />
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error && !applications.length) {
    return (
      <div className="admin-error">
        <AlertCircle size={24} />
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Grant Applications Admin Panel</h1>
        <div className="admin-stats">
          <div className="stat-box">
            <h4>Total</h4>
            <p>{applications.length}</p>
          </div>
          <div className="stat-box pending">
            <h4>Pending</h4>
            <p>{applications.filter(app => app.status === 'PENDING').length}</p>
          </div>
          <div className="stat-box approved">
            <h4>Approved</h4>
            <p>{applications.filter(app => app.status === 'APPROVED').length}</p>
          </div>
          <div className="stat-box rejected">
            <h4>Rejected</h4>
            <p>{applications.filter(app => app.status === 'REJECTED').length}</p>
          </div>
        </div>
      </header>

      {viewMode === 'list' ? (
        <>
          <div className="filter-bar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search applications..."
                value={filters.searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="filter-select">
              <Filter size={18} />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
            <div className="filter-select">
              <DollarSign size={18} />
              <select
                value={filters.fundingType}
                onChange={(e) => handleFilterChange('fundingType', e.target.value)}
              >
                <option value="">All Funding Types</option>
                {fundingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <button className="btn-reset" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          <div className="applications-table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('createdAt')}>
                    Date
                    {sorting.field === 'createdAt' && (
                      <span className="sort-arrow">
                        {sorting.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('name')}>
                    Name
                    {sorting.field === 'name' && (
                      <span className="sort-arrow">
                        {sorting.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('fundingType')}>
                    Funding Type
                    {sorting.field === 'fundingType' && (
                      <span className="sort-arrow">
                        {sorting.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('fundingAmount')}>
                    Amount
                    {sorting.field === 'fundingAmount' && (
                      <span className="sort-arrow">
                        {sorting.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentApplications.length > 0 ? (
                  currentApplications.map((application) => (
                    <tr key={application._id}>
                      <td>{formatDate(application.createdAt)}</td>
                      <td>
                        {application.personalInfo.firstName} {application.personalInfo.lastName}
                      </td>
                      <td>{application.fundingInfo.fundingType}</td>
                      <td>${application.fundingInfo.fundingAmount.toLocaleString()}</td>
                      <td>{getStatusBadge(application.status)}</td>
                      <td>
                        <button 
                          className="btn-view" 
                          onClick={() => fetchApplicationDetails(application._id)}
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {sortedApplications.length > applicationsPerPage && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <ArrowLeft size={16} />
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        selectedApplication && (
          <div className="application-detail">
            <div className="detail-header">
              <button onClick={backToList} className="btn-back">
                <ArrowLeft size={16} /> Back to List
              </button>
              
              <div className="application-id">
                <FileText size={16} />
                <span>Application ID: {selectedApplication._id}</span>
              </div>
              
              <div className="status-actions">
                <div className="current-status">
                  Current Status: {getStatusBadge(selectedApplication.status)}
                </div>
                
                <div className="status-buttons">
                  <button
                    className={`btn-status approve ${selectedApplication.status === 'APPROVED' ? 'active' : ''}`}
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'APPROVED')}
                    disabled={selectedApplication.status === 'APPROVED'}
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  
                  <button
                    className={`btn-status reject ${selectedApplication.status === 'REJECTED' ? 'active' : ''}`}
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'REJECTED')}
                    disabled={selectedApplication.status === 'REJECTED'}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            </div>

            <div className="application-content">
              <div className="detail-section">
                <h3><User size={18} /> Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="field-label">Full Name:</span>
                    <span className="field-value">
                      {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{selectedApplication.personalInfo.email}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Phone:</span>
                    <span className="field-value">{selectedApplication.personalInfo.phoneNumber}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Date of Birth:</span>
                    <span className="field-value">
                      {new Date(selectedApplication.personalInfo.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">SSN:</span>
                    <span className="field-value">{selectedApplication.personalInfo.ssn}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Gender:</span>
                    <span className="field-value">{selectedApplication.personalInfo.gender || 'Not specified'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Ethnicity:</span>
                    <span className="field-value">{selectedApplication.personalInfo.ethnicity || 'Not specified'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Facebook Email:</span>
                    <span className="field-value">{selectedApplication.facebookEmail || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3><Briefcase size={18} /> Employment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="field-label">Employment Status:</span>
                    <span className="field-value">
                      {selectedApplication.employmentInfo.employmentStatus || 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Income Level:</span>
                    <span className="field-value">
                      {selectedApplication.employmentInfo.incomeLevel || 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Education Level:</span>
                    <span className="field-value">
                      {selectedApplication.employmentInfo.educationLevel || 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Citizenship Status:</span>
                    <span className="field-value">
                      {selectedApplication.employmentInfo.citizenshipStatus || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3><Home size={18} /> Address Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="field-label">Street Address:</span>
                    <span className="field-value">{selectedApplication.addressInfo.streetAddress}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">City:</span>
                    <span className="field-value">{selectedApplication.addressInfo.city}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">State:</span>
                    <span className="field-value">{selectedApplication.addressInfo.state}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">ZIP Code:</span>
                    <span className="field-value">{selectedApplication.addressInfo.zip}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3><DollarSign size={18} /> Funding Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="field-label">Funding Type:</span>
                    <span className="field-value">{selectedApplication.fundingInfo.fundingType}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Amount Requested:</span>
                    <span className="field-value">${selectedApplication.fundingInfo.fundingAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Timeframe:</span>
                    <span className="field-value">{selectedApplication.fundingInfo.timeframe}</span>
                  </div>
                  
                  <div className="detail-item full-width">
                    <span className="field-label">Purpose:</span>
                    <div className="long-text-value">{selectedApplication.fundingInfo.fundingPurpose}</div>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>ID Verification Documents</h3>
                <div className="document-images">
                  <div className="document-image">
                    <h4>ID Front Side</h4>
                    {selectedApplication.documents.idCardFront ? (
                      <div className="image-container">
                        <img 
                          src={`/uploads/${selectedApplication.documents.idCardFront.split('/').pop()}`} 
                          alt="ID Card Front" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-id.png';
                          }}
                        />
                        <a 
                          href={`/uploads/${selectedApplication.documents.idCardFront.split('/').pop()}`} 
                          download
                          className="download-link"
                        >
                          <Download size={16} /> Download
                        </a>
                      </div>
                    ) : (
                      <div className="no-document">No front ID image provided</div>
                    )}
                  </div>
                  
                  <div className="document-image">
                    <h4>ID Back Side</h4>
                    {selectedApplication.documents.idCardBack ? (
                      <div className="image-container">
                        <img 
                          src={`/uploads/${selectedApplication.documents.idCardBack.split('/').pop()}`} 
                          alt="ID Card Back" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-id.png';
                          }}
                        />
                        <a 
                          href={`/uploads/${selectedApplication.documents.idCardBack.split('/').pop()}`} 
                          download
                          className="download-link"
                        >
                          <Download size={16} /> Download
                        </a>
                      </div>
                    ) : (
                      <div className="no-document">No back ID image provided</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Additional Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="field-label">Agrees to Communication:</span>
                    <span className="field-value">
                      {selectedApplication.agreeToCommunication ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Terms Accepted:</span>
                    <span className="field-value">
                      {selectedApplication.termsAccepted ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="field-label">Application Date:</span>
                    <span className="field-value">{formatDate(selectedApplication.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 && (
                <div className="detail-section">
                  <h3>Status History</h3>
                  <div className="status-history">
                    {selectedApplication.statusHistory.map((history, index) => (
                      <div key={index} className="history-item">
                        <div className={`status-circle ${history.status.toLowerCase()}`}></div>
                        <div className="history-details">
                          <div className="history-status">{history.status}</div>
                          <div className="history-date">{formatDate(history.changedAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AdminPanel;