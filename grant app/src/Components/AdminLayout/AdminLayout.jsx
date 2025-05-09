import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { 
  LogOut, 
  Users, 
  Settings, 
  Home, 
  BarChart2, 
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const storedUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    if (!token || storedUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    
    setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  // If no user, return nothing (will redirect in useEffect)
  if (!user) return null;

  return (
    <div className="admin-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        
        <nav className="admin-nav">
          <ul>
            <li>
              <a 
                href="/admin/dashboard" 
                className={window.location.pathname === '/admin/dashboard' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/dashboard');
                  setMenuOpen(false);
                }}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin/applications" 
                className={window.location.pathname === '/admin/applications' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/applications');
                  setMenuOpen(false);
                }}
              >
                <FileText size={18} />
                <span>Applications</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin/users" 
                className={window.location.pathname === '/admin/users' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/users');
                  setMenuOpen(false);
                }}
              >
                <Users size={18} />
                <span>Users</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin/stats" 
                className={window.location.pathname === '/admin/stats' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/stats');
                  setMenuOpen(false);
                }}
              >
                <BarChart2 size={18} />
                <span>Statistics</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin/settings" 
                className={window.location.pathname === '/admin/settings' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/settings');
                  setMenuOpen(false);
                }}
              >
                <Settings size={18} />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{user.name || 'Admin'}</p>
              <p className="admin-user-email">{user.email}</p>
            </div>
          </div>
          
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;