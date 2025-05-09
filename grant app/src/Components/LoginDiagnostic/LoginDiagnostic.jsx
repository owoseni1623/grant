import React, { useState } from 'react';
import axios from 'axios';

/*
 * This is a diagnostic component to help troubleshoot login issues.
 * Add this to your app temporarily to help identify problems.
 * 
 * Usage:
 * Import and add <LoginDiagnostic /> to any page where you're having auth issues.
 */
const LoginDiagnostic = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState('fetch');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [endpoint, setEndpoint] = useState('/auth/login');
  const [apiBase, setApiBase] = useState(process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api');

  const runTest = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      let response;
      const url = `${apiBase}${endpoint}`;
      const payload = { email, password };
      const startTime = Date.now();
      
      if (method === 'fetch') {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        
        const responseTime = Date.now() - startTime;
        
        const status = response.status;
        const text = await response.text();
        let data;
        
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { rawText: text };
        }
        
        setResult({
          success: status >= 200 && status < 300,
          status,
          responseTime,
          data,
          headers: {
            'content-type': response.headers.get('content-type'),
          },
        });
      } else if (method === 'axios') {
        response = await axios.post(url, payload, {
          withCredentials: true,
        });
        
        const responseTime = Date.now() - startTime;
        
        setResult({
          success: true,
          status: response.status,
          responseTime,
          data: response.data,
          headers: response.headers,
        });
      } else if (method === 'xhr') {
        const xhr = new XMLHttpRequest();
        
        response = await new Promise((resolve, reject) => {
          xhr.open('POST', url);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.withCredentials = true;
          
          xhr.onload = function() {
            const responseTime = Date.now() - startTime;
            let data;
            
            try {
              data = JSON.parse(xhr.responseText);
            } catch (e) {
              data = { rawText: xhr.responseText };
            }
            
            resolve({
              success: xhr.status >= 200 && xhr.status < 300,
              status: xhr.status,
              responseTime,
              data,
              statusText: xhr.statusText,
              headers: {
                'content-type': xhr.getResponseHeader('content-type'),
              },
            });
          };
          
          xhr.onerror = function() {
            const responseTime = Date.now() - startTime;
            reject({
              success: false,
              status: xhr.status,
              responseTime,
              statusText: xhr.statusText,
              error: 'Network error',
            });
          };
          
          xhr.send(JSON.stringify(payload));
        });
        
        setResult(response);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        stack: error.stack,
        data: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Login Diagnostic Tool</h2>
      <p><i>Use this to troubleshoot API connection issues</i></p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>API Base URL:</label>
        <input 
          type="text" 
          value={apiBase} 
          onChange={(e) => setApiBase(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Endpoint:</label>
        <input 
          type="text" 
          value={endpoint} 
          onChange={(e) => setEndpoint(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Request Method:</label>
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="fetch">Fetch API</option>
          <option value="axios">Axios</option>
          <option value="xhr">XMLHttpRequest</option>
        </select>
      </div>
      
      <button 
        onClick={runTest} 
        disabled={isLoading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'wait' : 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        {isLoading ? 'Testing...' : 'Run Test'}
      </button>
      
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          border: `1px solid ${result.success ? '#4caf50' : '#f44336'}`,
          backgroundColor: `${result.success ? '#e8f5e9' : '#ffebee'}`,
          borderRadius: '4px'
        }}>
          <h3>Results</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Status:</strong> {result.status} {result.statusText && `(${result.statusText})`}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Success:</strong> {result.success ? 'Yes' : 'No'}
          </div>
          {result.responseTime && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Response Time:</strong> {result.responseTime}ms
            </div>
          )}
          {result.error && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Error:</strong> {result.error}
            </div>
          )}
          {result.headers && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Headers:</strong>
              <pre style={{ 
                backgroundColor: '#f1f1f1', 
                padding: '8px', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(result.headers, null, 2)}
              </pre>
            </div>
          )}
          <div>
            <strong>Response Data:</strong>
            <pre style={{ 
              backgroundColor: '#f1f1f1', 
              padding: '8px', 
              borderRadius: '4px',
              overflow: 'auto', 
              maxHeight: '300px' 
            }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Diagnostic information:</p>
        <ul>
          <li>Environment: {process.env.NODE_ENV}</li>
          <li>Browser: {navigator.userAgent}</li>
          <li>Cookies enabled: {navigator.cookieEnabled.toString()}</li>
          <li>Default API URL: {process.env.REACT_APP_API_URL || 'Not set'}</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginDiagnostic;