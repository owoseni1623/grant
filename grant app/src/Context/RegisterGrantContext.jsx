import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

// Configure axios for the entire application
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://grant-api.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Validators
const validators = {
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  formatPhone: (phone) => phone.replace(/[^\d+]/g, ''), // Updated to keep + symbol
  isValidPhone: (phone) => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    return /^\+?\d{1,4}\d{6,15}$/.test(cleaned); // Allow country code + phone number
  },
  isValidPassword: (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
  }
};

// Action Types
export const ACTION_TYPES = {
  UPDATE_FORM: 'UPDATE_FORM',
  SET_REGISTRATION_ERRORS: 'SET_REGISTRATION_ERRORS',
  CLEAR_FORM: 'CLEAR_FORM',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  SET_LOGIN_FORM: 'SET_LOGIN_FORM',
  SET_ADMIN_LOGIN_FORM: 'SET_ADMIN_LOGIN_FORM',
  SET_LOGIN_ERRORS: 'SET_LOGIN_ERRORS',
  SET_ADMIN_LOGIN_ERRORS: 'SET_ADMIN_LOGIN_ERRORS',
  SET_AUTH_USER: 'SET_AUTH_USER',
  SET_IS_AUTHENTICATED: 'SET_IS_AUTHENTICATED',
  LOGOUT: 'LOGOUT',
};

// Initial State - Ensure all form fields have string default values
const initialState = {
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    primaryPhone: '',
    mobilePhone: '',
    password: '',
    confirmPassword: '',
  },
  loginForm: {
    email: '',
    password: '',
  },
  adminLoginForm: {
    email: '',
    password: '',
  },
  errors: {},
  loginErrors: {},
  adminLoginErrors: {},
  loading: false,
  error: null,
  success: false,
  user: null,
  isAuthenticated: false,
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case ACTION_TYPES.SET_LOGIN_FORM:
      return {
        ...state,
        loginForm: {
          ...state.loginForm,
          ...action.payload,
        },
      };
    case ACTION_TYPES.SET_ADMIN_LOGIN_FORM:
      return {
        ...state,
        adminLoginForm: {
          ...state.adminLoginForm,
          ...action.payload,
        },
      };
    case ACTION_TYPES.SET_REGISTRATION_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case ACTION_TYPES.SET_LOGIN_ERRORS:
      return {
        ...state,
        loginErrors: action.payload,
      };
    case ACTION_TYPES.SET_ADMIN_LOGIN_ERRORS:
      return {
        ...state,
        adminLoginErrors: action.payload,
      };
    case ACTION_TYPES.CLEAR_FORM:
      return {
        ...state,
        formData: initialState.formData,
        errors: {},
      };
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        success: false,
      };
    case ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
        error: null,
      };
    case ACTION_TYPES.SET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case ACTION_TYPES.SET_IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

// Create Context
export const RegisterGrantContext = createContext();

// Provider Component
export const RegisterGrantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: ACTION_TYPES.SET_AUTH_USER, payload: user });
        } catch (error) {
          console.error('Error parsing user data from localStorage', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      }
    };
    
    checkAuth();
  }, []);

  const updateForm = useCallback((updates) => {
    dispatch({ 
      type: ACTION_TYPES.UPDATE_FORM, 
      payload: updates 
    });
  }, []);
  
  const updateLoginForm = useCallback((updates) => {
    dispatch({
      type: ACTION_TYPES.SET_LOGIN_FORM,
      payload: updates
    });
  }, []);
  
  const updateAdminLoginForm = useCallback((updates) => {
    dispatch({
      type: ACTION_TYPES.SET_ADMIN_LOGIN_FORM,
      payload: updates
    });
  }, []);

  const validateField = useCallback((name, value) => {
    const errors = { ...state.errors };
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors[name] = 'First name is required';
        } else if (value.trim().length < 2) {
          errors[name] = 'First name must be at least 2 characters long';
        } else {
          delete errors[name];
        }
        break;
        
      case 'lastName':
        if (!value.trim()) {
          errors[name] = 'Last name is required';
        } else if (value.trim().length < 2) {
          errors[name] = 'Last name must be at least 2 characters long';
        } else {
          delete errors[name];
        }
        break;
        
      case 'email':
        if (!value) {
          errors[name] = 'Email is required';
        } else if (!validators.isValidEmail(value)) {
          errors[name] = 'Please enter a valid email address';
        } else {
          delete errors[name];
        }
        break;
        
      case 'primaryPhone':
        if (!value) {
          errors[name] = 'Primary phone is required';
        } else if (!validators.isValidPhone(value)) {
          errors[name] = 'Please enter a valid phone number with country code (e.g., +234 for Nigeria)';
        } else {
          delete errors[name];
        }
        break;

      case 'mobilePhone':
        if (value && !validators.isValidPhone(value)) {
          errors[name] = 'Please enter a valid phone number with country code (e.g., +234 for Nigeria)';
        } else {
          delete errors[name];
        }
        break;
        
      case 'password':
        if (!value) {
          errors[name] = 'Password is required';
        } else if (value.length < 8) {
          errors[name] = 'Password must be at least 8 characters long';
        } else if (!/[A-Z]/.test(value)) {
          errors[name] = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(value)) {
          errors[name] = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(value)) {
          errors[name] = 'Password must contain at least one number';
        } else {
          delete errors[name];
          
          // Check password match when password changes
          if (state.formData.confirmPassword && 
              state.formData.confirmPassword !== value) {
            errors['confirmPassword'] = 'Passwords must match exactly';
          }
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors[name] = 'Please confirm your password';
        } else if (value !== state.formData.password) {
          errors[name] = 'Passwords must match exactly';
        } else {
          delete errors[name];
        }
        break;
    }

    dispatch({
      type: ACTION_TYPES.SET_REGISTRATION_ERRORS,
      payload: errors
    });

    return Object.keys(errors).length === 0;
  }, [state.formData]);
  
  // Login form validation
  const validateLoginField = useCallback((name, value) => {
    const errors = { ...state.loginErrors };
    
    switch (name) {
      case 'email':
        if (!value) {
          errors[name] = 'Email is required';
        } else if (!validators.isValidEmail(value)) {
          errors[name] = 'Please enter a valid email address';
        } else {
          delete errors[name];
        }
        break;
        
      case 'password':
        if (!value) {
          errors[name] = 'Password is required';
        } else if (value.length < 6) {
          errors[name] = 'Password must be at least 6 characters long';
        } else {
          delete errors[name];
        }
        break;
    }
    
    dispatch({
      type: ACTION_TYPES.SET_LOGIN_ERRORS,
      payload: errors
    });
    
    return Object.keys(errors).length === 0;
  }, [state.loginErrors]);
  
  // Admin login form validation
  const validateAdminLoginField = useCallback((name, value) => {
    const errors = { ...state.adminLoginErrors };
    
    switch (name) {
      case 'email':
        if (!value) {
          errors[name] = 'Email is required';
        } else if (!validators.isValidEmail(value)) {
          errors[name] = 'Please enter a valid email address';
        } else {
          delete errors[name];
        }
        break;
        
      case 'password':
        if (!value) {
          errors[name] = 'Password is required';
        } else if (value.length < 6) {
          errors[name] = 'Password must be at least 6 characters long';
        } else {
          delete errors[name];
        }
        break;
    }
    
    dispatch({
      type: ACTION_TYPES.SET_ADMIN_LOGIN_ERRORS,
      payload: errors
    });
    
    return Object.keys(errors).length === 0;
  }, [state.adminLoginErrors]);

  const handleRegisterSubmit = useCallback(async (e) => {
    e.preventDefault();
      
    // Reset previous states
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: false });
      
    // More comprehensive client-side validation
    const fieldsToValidate = [
      'firstName', 'lastName', 'email', 'primaryPhone', 
      'password', 'confirmPassword'
    ];
      
    let isValid = true;
    const currentErrors = {};
      
    // Validate each field
    fieldsToValidate.forEach(field => {
      const fieldValue = state.formData[field];
      if (!validateField(field, fieldValue)) {
        isValid = false;
      }
    });
  
    // Explicit password matching validation
    if (state.formData.password !== state.formData.confirmPassword) {
      currentErrors.confirmPassword = 'Passwords must match exactly';
      isValid = false;
    }
  
    // Additional password complexity check
    if (!validators.isValidPassword(state.formData.password)) {
      currentErrors.password = 'Password does not meet complexity requirements';
      isValid = false;
    }
  
    // If validation fails, dispatch errors and return
    if (!isValid) {
      dispatch({
        type: ACTION_TYPES.SET_REGISTRATION_ERRORS,
        payload: currentErrors
      });
      return false;
    }
  
    // Prepare submission data
    const submitData = {
      firstName: state.formData.firstName.trim(),
      lastName: state.formData.lastName.trim(),
      email: state.formData.email.trim(),
      primaryPhone: validators.formatPhone(state.formData.primaryPhone),
      mobilePhone: state.formData.mobilePhone 
        ? validators.formatPhone(state.formData.mobilePhone) 
        : '',
      password: state.formData.password,
      confirmPassword: state.formData.confirmPassword
    };
  
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        
      const response = await axiosInstance.post('/api/auth/register', submitData);
        
      // Handle successful registration
      dispatch({ type: ACTION_TYPES.CLEAR_FORM });
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
        
      return response.data;
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      dispatch({ 
        type: ACTION_TYPES.SET_ERROR, 
        payload: errorMessage 
      });
      
      // Handle specific field errors from server
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors.reduce((acc, err) => {
          acc[err.field] = err.message;
          return acc;
        }, {});
  
        dispatch({
          type: ACTION_TYPES.SET_REGISTRATION_ERRORS,
          payload: serverErrors
        });
      }
      
      return false;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, [state.formData, validateField]);

  // User login function 
  const login = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Reset previous states
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: false });
    
    // Validate login form fields
    let isValid = true;
    const loginFields = ['email', 'password'];
    
    loginFields.forEach(field => {
      const fieldValue = state.loginForm[field];
      if (!validateLoginField(field, fieldValue)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      return false;
    }
    
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      
      // Make login request
      const response = await axiosInstance.post('/api/auth/login', {
        email: state.loginForm.email,
        password: state.loginForm.password
      });
      
      const userData = response.data;
      
      if (!userData || !userData.token) {
        throw new Error('Invalid response from server - missing authentication token');
      }
      
      // Store user data in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify({
        id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role
      }));
      
      // Update state
      dispatch({ type: ACTION_TYPES.SET_AUTH_USER, payload: userData });
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      
      return true;
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      
      dispatch({ 
        type: ACTION_TYPES.SET_ERROR, 
        payload: errorMessage 
      });
      
      return false;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, [state.loginForm, validateLoginField]);
  
  // Admin login function
  const adminLogin = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Reset previous states
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: false });
    
    // Validate admin login form fields
    let isValid = true;
    const adminLoginFields = ['email', 'password'];
    
    adminLoginFields.forEach(field => {
      const fieldValue = state.adminLoginForm[field];
      if (!validateAdminLoginField(field, fieldValue)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      return false;
    }
    
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      
      // Make admin login request
      const response = await axiosInstance.post('/api/auth/admin/login', {
        email: state.adminLoginForm.email,
        password: state.adminLoginForm.password
      });
      
      const userData = response.data;
      
      if (!userData || !userData.token) {
        throw new Error('Invalid response from server - missing authentication token');
      }
      
      // Check if user is admin
      if (userData.role !== 'ADMIN') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Store admin data in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify({
        id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role
      }));
      
      // Update state
      dispatch({ type: ACTION_TYPES.SET_AUTH_USER, payload: userData });
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      
      return true;
    } catch (error) {
      console.error('Admin Login Error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Admin login failed. Please verify your credentials.';
      
      dispatch({ 
        type: ACTION_TYPES.SET_ERROR, 
        payload: errorMessage 
      });
      
      return false;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, [state.adminLoginForm, validateAdminLoginField]);
  
  // Logout function
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Update state
    dispatch({ type: ACTION_TYPES.LOGOUT });
    
    return true;
  }, []);

  const clearRegistrationForm = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_FORM });
  }, []);
  
  const setError = useCallback((errorMessage) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
  }, []);

  return (
    <RegisterGrantContext.Provider 
      value={{
        state,
        dispatch,
        updateForm,
        updateLoginForm,
        updateAdminLoginForm,
        validateField,
        validateLoginField,
        validateAdminLoginField,
        handleRegisterSubmit,
        login,
        adminLogin,
        logout,
        clearRegistrationForm,
        setError,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        success: state.success
      }}
    >
      {children}
    </RegisterGrantContext.Provider>
  );
};

// Custom Hook
export const useRegisterGrant = () => {
  const context = useContext(RegisterGrantContext);
  if (context === undefined) {
    throw new Error('useRegisterGrant must be used within a RegisterGrantProvider');
  }
  return context;
};

export default RegisterGrantContext;