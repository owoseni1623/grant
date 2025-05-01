import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationList from './ApplicationList';
// import ApplicationDetails from '../../Components/admin/';
// import ReportGenerator from './ReportGenerator';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = async (page = 1, status = '', searchTerm = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/applications`, {
        params: { page, status, search: searchTerm },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setApplications(response.data.applications);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, notes) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/applications/${applicationId}/status`, 
        { status, adminNotes: notes },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Refresh the list or update the specific application
      fetchApplications(currentPage);
      setSelectedApplication(null);
    } catch (err) {
      setError('Failed to update application status');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Grant Applications Admin Panel</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-content">
        <ApplicationList 
          applications={applications}
          onSelectApplication={setSelectedApplication}
          onPageChange={fetchApplications}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
        />

        {selectedApplication && (
          <ApplicationDetails 
            application={selectedApplication}
            onUpdateStatus={updateApplicationStatus}
          />
        )}
      </div>

      <ReportGenerator />
    </div>
  );
};

export default AdminDashboard;