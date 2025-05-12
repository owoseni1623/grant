import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaQuestion, FaSync } from 'react-icons/fa';

const LoginDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState({
    internetConnection: null,
    apiConnection: null,
    corsStatus: null,
    cookiesEnabled: null,
    localStorageAccess: null
  });
  const [isRunning, setIsRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnosticResults({
      internetConnection: null,
      apiConnection: null,
      corsStatus: null,
      cookiesEnabled: null,
      localStorageAccess: null
    });

    // Check internet connection
    const internet = navigator.onLine;
    setDiagnosticResults(prev => ({ ...prev, internetConnection: internet }));

    // Check if cookies are enabled
    const cookiesEnabled = navigator.cookieEnabled;
    setDiagnosticResults(prev => ({ ...prev, cookiesEnabled }));

    // Check localStorage access
    try {
      localStorage.setItem('diagnosticTest', 'test');
      const testValue = localStorage.getItem('diagnosticTest');
      localStorage.removeItem('diagnosticTest');
      setDiagnosticResults(prev => ({ 
        ...prev, 
        localStorageAccess: testValue === 'test' 
      }));
    } catch (e) {
      setDiagnosticResults(prev => ({ ...prev, localStorageAccess: false }));
    }

    // Check API connection
    try {
      const apiUrl = 'https://grant-api.onrender.com';
      // First try OPTIONS, which is more likely to succeed with CORS
      try {
        const optionsResponse = await fetch(`${apiUrl}/api/health`, { 
          method: 'OPTIONS',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
        });
        
        setDiagnosticResults(prev => ({ 
          ...prev, 
          apiConnection: optionsResponse.ok,
          corsStatus: optionsResponse.ok ? 'supported' : 'limited'
        }));
      } catch (corsError) {
        console.log('CORS diagnostic error:', corsError);
        // Try with no-cors as fallback
        try {
          await fetch(apiUrl, { 
            method: 'GET',
            mode: 'no-cors'
          });
          // If we get here, the request didn't throw, but we can't read the response
          setDiagnosticResults(prev => ({ 
            ...prev, 
            apiConnection: true,
            corsStatus: 'restricted' 
          }));
        } catch (e) {
          setDiagnosticResults(prev => ({ 
            ...prev, 
            apiConnection: false,
            corsStatus: 'unknown'
          }));
        }
      }
    } catch (e) {
      setDiagnosticResults(prev => ({ 
        ...prev, 
        apiConnection: false,
        corsStatus: 'error'
      }));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    if (status === null) return <FaQuestion style={{ color: '#999' }} />;
    if (status === true) return <FaCheckCircle style={{ color: 'green' }} />;
    return <FaTimesCircle style={{ color: 'red' }} />;
  };

  const getStatusText = (key, status) => {
    if (status === null) return 'Checking...';
    
    const statusTexts = {
      internetConnection: {
        true: 'Internet connection is active',
        false: 'No internet connection detected'
      },
      apiConnection: {
        true: 'API server is reachable',
        false: 'Cannot connect to API server'
      },
      corsStatus: {
        supported: 'CORS is properly configured',
        limited: 'CORS has limited support',
        restricted: 'CORS is restricted',
        unknown: 'CORS status unknown',
        error: 'CORS check failed'
      },
      cookiesEnabled: {
        true: 'Cookies are enabled',
        false: 'Cookies are disabled'
      },
      localStorageAccess: {
        true: 'LocalStorage is accessible',
        false: 'Cannot access LocalStorage'
      }
    };
    
    return statusTexts[key][status] || `Status: ${status}`;
  };

  return (
    <div style={{
      margin: '20px auto',
      maxWidth: '600px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h3 style={{ margin: '0', fontSize: '16px' }}>Connection Diagnostic Tool</h3>
        <button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px'
          }}
        >
          {isRunning ? (
            <>
              <FaSync className="spinner" /> Running...
            </>
          ) : (
            <>
              <FaSync /> Run Tests
            </>
          )}
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {getStatusIcon(diagnosticResults.internetConnection)}
          <span>{getStatusText('internetConnection', diagnosticResults.internetConnection)}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {getStatusIcon(diagnosticResults.apiConnection)}
          <span>{getStatusText('apiConnection', diagnosticResults.apiConnection)}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {getStatusIcon(diagnosticResults.corsStatus === 'supported' || diagnosticResults.corsStatus === 'limited')}
          <span>{getStatusText('corsStatus', diagnosticResults.corsStatus)}</span>
        </div>
      </div>
      
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          textDecoration: 'underline',
          color: '#555',
          cursor: 'pointer',
          padding: '5px 0',
          fontSize: '12px',
          display: 'block',
          width: '100%',
          textAlign: 'center'
        }}
      >
        {expanded ? 'Show Less' : 'Show More Details'}
      </button>
      
      {expanded && (
        <div style={{ marginTop: '10px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {getStatusIcon(diagnosticResults.cookiesEnabled)}
            <span>{getStatusText('cookiesEnabled', diagnosticResults.cookiesEnabled)}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {getStatusIcon(diagnosticResults.localStorageAccess)}
            <span>{getStatusText('localStorageAccess', diagnosticResults.localStorageAccess)}</span>
          </div>
          
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Connection Information:</div>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>API URL: https://grant-api.onrender.com</li>
              <li>Browser: {navigator.userAgent}</li>
              <li>Frontend URL: {window.location.origin}</li>
              <li>Date/Time: {new Date().toLocaleString()}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginDiagnostic;