import React, { useState, useEffect } from 'react';

const LoginDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [testCredentials, setTestCredentials] = useState({
    email: '',
    password: ''
  });
  const [showTestLogin, setShowTestLogin] = useState(false);
  const [testLoginResult, setTestLoginResult] = useState(null);

  // Initialize API URL on component mount
  useEffect(() => {
    const defaultApiUrl = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';
    setApiUrl(defaultApiUrl);
  }, []);

  const runDiagnostic = async () => {
    setLoading(true);
    setDiagnosticResults(null);
    
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
      network: 'Testing...',
      apiAvailable: false
    };

    // Test API endpoints
    const endpoints = [
      { name: 'Login', path: '/auth/login', method: 'GET' },
      { name: 'Users', path: '/users', method: 'GET' },
      { name: 'Health', path: '/health', method: 'GET' }
    ];

    try {
      // Test network connectivity
      const networkTest = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      results.network = networkTest.type === 'opaque' ? 'Connected' : 'Issue detected';
      
      // Test CORS configuration
      try {
        const corsTest = await fetch(apiUrl, { 
          method: 'OPTIONS',
          cache: 'no-cache'
        });
        results.cors = corsTest.ok ? 'CORS configured correctly' : `CORS issue: ${corsTest.status}`;
      } catch (error) {
        results.cors = `CORS error: ${error.message}`;
      }

      // Test individual endpoints
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${apiUrl}${endpoint.path}`, {
            method: endpoint.method,
            headers: {
              'Content-Type': 'application/json',
              // Include auth token if available
              ...(localStorage.getItem('token') ? { 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
              } : {})
            },
            cache: 'no-cache'
          });

          results.endpoints[endpoint.name] = {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
          };

          // If any endpoint responds, API is available
          if (response.ok) {
            results.apiAvailable = true;
          }
        } catch (error) {
          results.endpoints[endpoint.name] = {
            error: error.message,
            status: 'Error',
            ok: false
          };
        }
      }
    } catch (error) {
      results.network = `Network error: ${error.message}`;
    }

    setDiagnosticResults(results);
    setLoading(false);
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    setTestLoginResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCredentials),
        cache: 'no-cache'
      });

      const data = await response.json();

      setTestLoginResult({
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Login successful' : `Login failed: ${data.message || response.statusText}`,
        data: response.ok ? data : null
      });
    } catch (error) {
      setTestLoginResult({
        success: false,
        message: `Login attempt error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    alert('Local storage auth data cleared');
    runDiagnostic();
  };

  const formatResults = (results) => {
    return JSON.stringify(results, null, 2);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Login System Diagnostic</h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-semibold">API URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="API URL"
          />
          <button
            onClick={runDiagnostic}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Running...' : 'Run Diagnostic'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Auth Tools</h2>
        </div>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={clearLocalStorage}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Auth Data
          </button>
          
          <button
            onClick={() => setShowTestLogin(!showTestLogin)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showTestLogin ? 'Hide Test Login' : 'Show Test Login'}
          </button>
        </div>
        
        {showTestLogin && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Test Login</h3>
            <form onSubmit={handleTestLogin}>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  value={testCredentials.email}
                  onChange={(e) => setTestCredentials({...testCredentials, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  value={testCredentials.password}
                  onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>
            </form>
            
            {testLoginResult && (
              <div className={`mt-4 p-3 rounded ${testLoginResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-semibold">{testLoginResult.message}</p>
                {testLoginResult.data && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(testLoginResult.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {diagnosticResults && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Diagnostic Results</h2>
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${diagnosticResults.apiAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              API Status: {diagnosticResults.apiAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3 border rounded bg-gray-50">
              <h3 className="font-semibold">Network</h3>
              <p>{diagnosticResults.network}</p>
            </div>
            <div className="p-3 border rounded bg-gray-50">
              <h3 className="font-semibold">CORS</h3>
              <p>{diagnosticResults.cors}</p>
            </div>
            <div className="p-3 border rounded bg-gray-50">
              <h3 className="font-semibold">Local Storage</h3>
              <p>Token: {diagnosticResults.localStorage.token}</p>
              <p>User Data: {diagnosticResults.localStorage.userData}</p>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2">Endpoint Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(diagnosticResults.endpoints).map(([name, result]) => (
              <div key={name} className="p-3 border rounded bg-gray-50">
                <h4 className="font-semibold">{name}</h4>
                <p className={result.ok ? 'text-green-600' : 'text-red-600'}>
                  Status: {result.status} {result.statusText && `(${result.statusText})`}
                </p>
                {result.error && <p className="text-red-600 text-sm">{result.error}</p>}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Raw Results</h3>
            <pre className="p-4 bg-gray-800 text-green-400 rounded-lg text-xs overflow-auto">
              {formatResults(diagnosticResults)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginDiagnostic;