import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config';
import axios from 'axios';
import './AdminPanel.css';
import { Eye, EyeOff, Check, X, UserCheck, Download, Search, RefreshCw } from 'lucide-react';

const AdminPanel = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  
  // Admin credentials
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Application data
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [showSSN, setShowSSN] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  const navigate = useNavigate();

  // Check if admin is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token with backend
      axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_VERIFY}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.valid) {
          setIsAuthenticated(true);
          fetchApplications(token);
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Auth verification error:', error);
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch applications from API
  const fetchApplications = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_APPLICATIONS}`, {
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('adminToken')}` }
      });
      
      setApplications(response.data);
      applyFilters(response.data, searchTerm, statusFilter, dateFilter);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    }
  };

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      // Use the admin-specific login endpoint
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_LOGIN}`, credentials);
      localStorage.setItem('adminToken', response.data.token);
      setIsAuthenticated(true);
      fetchApplications(response.data.token);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setApplications([]);
    setSelectedApplication(null);
    setViewMode('list');
  };

  // Handle input changes for login form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle application status update
  const updateApplicationStatus = async (applicationId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_APPLICATIONS}/${applicationId}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      
      // Update local state
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication(prev => ({
          ...prev,
          status: newStatus
        }));
      }
      
      // Update in the applications list
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      // Also update filtered applications
      setFilteredApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      alert(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter and search applications
  const applyFilters = (apps, search, status, date) => {
    let filtered = [...apps];
    
    // Apply search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(app => 
        app.personalInfo.firstName.toLowerCase().includes(searchLower) ||
        app.personalInfo.lastName.toLowerCase().includes(searchLower) ||
        app.personalInfo.email.toLowerCase().includes(searchLower) ||
        app._id.toLowerCase().includes(searchLower) ||
        app.personalInfo.ssn.includes(search)
      );
    }
    
    // Apply status filter
    if (status !== 'ALL') {
      filtered = filtered.filter(app => app.status === status);
    }
    
    // Apply date filter
    if (date !== 'ALL') {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      filtered = filtered.filter(app => {
        const appDate = new Date(app.createdAt);
        switch (date) {
          case 'TODAY':
            return appDate >= today;
          case 'YESTERDAY':
            return appDate >= yesterday && appDate < today;
          case 'LAST_WEEK':
            return appDate >= lastWeek;
          case 'LAST_MONTH':
            return appDate >= lastMonth;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      // Extract the values to compare based on the sort key
      switch (sortConfig.key) {
        case 'name':
          aValue = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase();
          bValue = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`.toLowerCase();
          break;
        case 'email':
          aValue = a.personalInfo.email.toLowerCase();
          bValue = b.personalInfo.email.toLowerCase();
          break;
        case 'fundingAmount':
          aValue = a.fundingInfo.fundingAmount;
          bValue = b.fundingInfo.fundingAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      // Compare the values based on the sort direction
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredApplications(filtered);
  };

  // Handle search and filter changes
  useEffect(() => {
    applyFilters(applications, searchTerm, statusFilter, dateFilter);
  }, [searchTerm, statusFilter, dateFilter, sortConfig]);

  // Handle view application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setViewMode('detail');
  };

  // Handle back to list view
  const backToList = () => {
    setSelectedApplication(null);
    setViewMode('list');
  };

  // Format SSN for display
  const formatSSN = (ssn) => {
    if (!showSSN) {
      return 'XXX-XX-' + ssn.slice(-4);
    }
    return ssn;
  };

  // Handle requesting ID documents download
  const handleDownloadDocument = async (documentPath, documentType) => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_DOCUMENTS}/${encodeURIComponent(documentPath)}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = documentPath.split('/').pop();
      link.setAttribute('download', `${documentType}-${filename}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  // Handle sorting change
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get the sort indicator for table header
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  // Render login form if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            {loginError && <div className="login-error">{loginError}</div>}
            <div className="admin-form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="admin-login-btn" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-loading">
        <RefreshCw className="loading-icon" size={40} />
        <p>Loading...</p>
      </div>
    );
  }

  // Render applications list view
  if (viewMode === 'list') {
    return (
      <div className="admin-panel-container">
        <div className="admin-header">
          <h1>Grant Applications Admin Panel</h1>
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        
        <div className="admin-controls">
          <div className="admin-search">
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name, email, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="admin-filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Date:</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="YESTERDAY">Yesterday</option>
                <option value="LAST_WEEK">Last 7 Days</option>
                <option value="LAST_MONTH">Last 30 Days</option>
              </select>
            </div>
            
            <button 
              className="refresh-btn"
              onClick={() => fetchApplications()}
              disabled={isLoading}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>No applications found matching your filters.</p>
          </div>
        ) : (
          <div className="applications-table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')}>
                    Applicant Name{getSortIndicator('name')}
                  </th>
                  <th onClick={() => requestSort('email')}>
                    Email{getSortIndicator('email')}
                  </th>
                  <th onClick={() => requestSort('fundingAmount')}>
                    Amount{getSortIndicator('fundingAmount')}
                  </th>
                  <th>Funding Type</th>
                  <th onClick={() => requestSort('status')}>
                    Status{getSortIndicator('status')}
                  </th>
                  <th onClick={() => requestSort('createdAt')}>
                    Date{getSortIndicator('createdAt')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application._id} className={`status-${application.status.toLowerCase()}`}>
                    <td>
                      {application.personalInfo.firstName} {application.personalInfo.lastName}
                    </td>
                    <td>{application.personalInfo.email}</td>
                    <td>${application.fundingInfo.fundingAmount.toLocaleString()}</td>
                    <td>{application.fundingInfo.fundingType}</td>
                    <td>
                      <span className={`status-badge ${application.status.toLowerCase()}`}>
                        {application.status}
                      </span>
                    </td>
                    <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="action-btn view"
                        onClick={() => viewApplicationDetails(application)}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="admin-footer">
          <p>Showing {filteredApplications.length} of {applications.length} applications</p>
        </div>
      </div>
    );
  }
  
  // Render application detail view
  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <div className="header-with-back">
          <button className="back-btn" onClick={backToList}>
            ← Back to List
          </button>
          <h1>Application Details</h1>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      {selectedApplication && (
        <div className="application-details">
          <div className="detail-header">
            <div className="applicant-summary">
              <h2>
                {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
              </h2>
              <span className={`status-badge ${selectedApplication.status.toLowerCase()}`}>
                {selectedApplication.status}
              </span>
            </div>
            
            <div className="detail-actions">
              {selectedApplication.status === 'PENDING' && (
                <>
                  <button 
                    className="action-btn approve"
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'APPROVED')}
                    disabled={isUpdating}
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button 
                    className="action-btn reject"
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'REJECTED')}
                    disabled={isUpdating}
                  >
                    <X size={16} />
                    Reject
                  </button>
                </>
              )}
              {selectedApplication.status === 'APPROVED' && (
                <button 
                  className="action-btn reject"
                  onClick={() => updateApplicationStatus(selectedApplication._id, 'REJECTED')}
                  disabled={isUpdating}
                >
                  <X size={16} />
                  Reject
                </button>
              )}
              {selectedApplication.status === 'REJECTED' && (
                <button 
                  className="action-btn approve"
                  onClick={() => updateApplicationStatus(selectedApplication._id, 'APPROVED')}
                  disabled={isUpdating}
                >
                  <Check size={16} />
                  Approve
                </button>
              )}
            </div>
          </div>
          
          <div className="detail-sections">
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Full Name:</label>
                  <span>{selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedApplication.personalInfo.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{selectedApplication.personalInfo.phoneNumber}</span>
                </div>
                <div className="detail-item ssn-item">
                  <label>SSN:</label>
                  <span>{formatSSN(selectedApplication.personalInfo.ssn)}</span>
                  <button 
                    className="toggle-visibility-btn"
                    onClick={() => setShowSSN(!showSSN)}
                    aria-label={showSSN ? "Hide SSN" : "Show SSN"}
                  >
                    {showSSN ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="detail-item">
                  <label>Date of Birth:</label>
                  <span>{new Date(selectedApplication.personalInfo.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <label>Gender:</label>
                  <span>{selectedApplication.personalInfo.gender || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <label>Ethnicity:</label>
                  <span>{selectedApplication.personalInfo.ethnicity || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Employment Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Employment Status:</label>
                  <span>{selectedApplication.employmentInfo.employmentStatus || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <label>Income Level:</label>
                  <span>{selectedApplication.employmentInfo.incomeLevel || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <label>Education Level:</label>
                  <span>{selectedApplication.employmentInfo.educationLevel || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <label>Citizenship Status:</label>
                  <span>{selectedApplication.employmentInfo.citizenshipStatus || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Address Information</h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label>Street Address:</label>
                  <span>{selectedApplication.addressInfo.streetAddress}</span>
                </div>
                <div className="detail-item">
                  <label>City:</label>
                  <span>{selectedApplication.addressInfo.city}</span>
                </div>
                <div className="detail-item">
                  <label>State:</label>
                  <span>{selectedApplication.addressInfo.state}</span>
                </div>
                <div className="detail-item">
                  <label>ZIP Code:</label>
                  <span>{selectedApplication.addressInfo.zip}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Funding Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Funding Type:</label>
                  <span>{selectedApplication.fundingInfo.fundingType}</span>
                </div>
                <div className="detail-item">
                  <label>Amount Requested:</label>
                  <span>${selectedApplication.fundingInfo.fundingAmount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Timeframe:</label>
                  <span>{selectedApplication.fundingInfo.timeframe || 'Not specified'}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Funding Purpose:</label>
                  <p className="purpose-text">{selectedApplication.fundingInfo.fundingPurpose}</p>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>ID Verification Documents</h3>
              <div className="documents-grid">
                <div className="document-item">
                  <h4>ID Card - Front</h4>
                  <button
                    className="document-download-btn"
                    onClick={() => handleDownloadDocument(selectedApplication.documents.idCardFront, 'id-front')}
                  >
                    <Download size={16} />
                    Download Document
                  </button>
                </div>
                <div className="document-item">
                  <h4>ID Card - Back</h4>
                  <button
                    className="document-download-btn"
                    onClick={() => handleDownloadDocument(selectedApplication.documents.idCardBack, 'id-back')}
                  >
                    <Download size={16} />
                    Download Document
                  </button>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Additional Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Application Date:</label>
                  <span>{new Date(selectedApplication.createdAt).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Application ID:</label>
                  <span>{selectedApplication._id}</span>
                </div>
                <div className="detail-item">
                  <label>Agreed to Communication:</label>
                  <span>{selectedApplication.agreeToCommunication ? 'Yes' : 'No'}</span>
                </div>
                <div className="detail-item">
                  <label>Terms Accepted:</label>
                  <span>{selectedApplication.termsAccepted ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;