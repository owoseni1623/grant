import React, { useState } from 'react';

const LoginDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api');

  const runDiagnostic = async () => {
    setLoading(true);
    const results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      apiUrl: apiUrl,
      endpoints: {},
      localStorage: {
        token: localStorage.getItem('token') ? 'Present' : 'Not present',
        userData: localStorage.getItem('userData') ? 'Present' : 'Not present',
      },
      cors: 'Testing...',
      network: 'Testing...'
    };

    // Test API endpoints
    const endpoints = [
      { name: 'Login', path: '/auth/login', method: 'OPTIONS' },
      { name: 'Admin Login', path: '/auth/admin/login', method: 'OPTIONS' },
      { name: 'Profile', path: '/auth/profile', method: 'OPTIONS' },
    ];

    for (const endpoint of endpoints) {
      try {
        // Use OPTIONS request to check if endpoint exists and which methods are allowed
        const response = await fetch(`${apiUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const allowedMethods = response.headers.get('Allow') || 
                              response.headers.get('Access-Control-Allow-Methods');
                              
        results.endpoints[endpoint.name] = {
          status: response.status,
          statusText: response.statusText,
          allowedMethods: allowedMethods || 'Not specified',
          ok: response.ok
        };
      } catch (error) {
        results.endpoints[endpoint.name] = {
          error: error.message,
          ok: false
        };
      }
    }

    // Test simple CORS request
    try {
      const corsResponse = await fetch(apiUrl, {
        method: 'HEAD'
      });
      results.cors = {
        status: corsResponse.status,
        corsHeaders: {
          'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin') || 'Not set',
          'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods') || 'Not set',
          'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers') || 'Not set'
        }
      };
    } catch (error) {
      results.cors = {
        error: error.message
      };
    }

    // Test general network connectivity
    try {
      const start = Date.now();
      await fetch('https://www.google.com', { mode: 'no-cors' });
      const end = Date.now();
      results.network = {
        status: 'Connected',
        pingTime: `${end - start}ms`
      };
    } catch (error) {
      results.network = {
        status: 'Disconnected',
        error: error.message
      };
    }

    setDiagnosticResults(results);
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '15px', 
      margin: '15px 0', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      fontSize: '14px'
    }}>
      <h3 style={{ marginTop: 0 }}>API Connection Diagnostic</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>
          API URL:
          <input 
            type="text" 
            value={apiUrl} 
            onChange={(e) => setApiUrl(e.target.value)}
            style={{ 
              width: '100%',
              padding: '5px',
              margin: '5px 0',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </label>
      </div>
      
      <button
        onClick={runDiagnostic}
        disabled={loading}
        style={{
          padding: '8px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Running Diagnosis...' : 'Run API Diagnostic'}
      </button>
      
      {diagnosticResults && (
        <div style={{ marginTop: '15px' }}>
          <h4>Diagnostic Results</h4>
          <pre style={{ 
            backgroundColor: '#f1f1f1', 
            padding: '10px', 
            borderRadius: '4px',
            overflowX: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(diagnosticResults, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>If you're seeing 405 errors, your API endpoints might not support the requested methods.</p>
        <p>Check that your backend routes are correctly configured.</p>
      </div>
    </div>
  );
};

export default LoginDiagnostic;