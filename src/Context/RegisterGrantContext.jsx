import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

// Configure axios for the entire application
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Validators
const validators = {
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  formatPhone: (phone) => phone.replace(/\D/g, ''),
  isValidPhone: (phone) => /^\d{10}$/.test(phone.replace(/\D/g, '')),
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
  errors: {},
  loading: false,
  error: null,
  success: false,
};

// Reducer
function registrationReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case ACTION_TYPES.SET_REGISTRATION_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case ACTION_TYPES.CLEAR_FORM:
      return {
        ...initialState,
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
    default:
      return state;
  }
}

// Create Context
export const RegisterGrantContext = createContext();

// Provider Component
export const RegisterGrantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  const updateForm = useCallback((updates) => {
    dispatch({ 
      type: ACTION_TYPES.UPDATE_FORM, 
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
        const formattedPrimaryPhone = validators.formatPhone(value);
        if (!value) {
          errors[name] = 'Primary phone is required';
        } else if (!validators.isValidPhone(value)) {
          errors[name] = 'Please enter a valid 10-digit phone number';
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
        
      case 'mobilePhone':
        if (value) {
          const formattedMobilePhone = validators.formatPhone(value);
          if (!validators.isValidPhone(value)) {
            errors[name] = 'Please enter a valid 10-digit phone number';
          } else {
            delete errors[name];
          }
        } else {
          delete errors[name];
        }
        break;
      
      default:
        break;
    }

    dispatch({
      type: ACTION_TYPES.SET_REGISTRATION_ERRORS,
      payload: errors
    });

    return Object.keys(errors).length === 0;
  }, [state.formData]);

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

  const clearRegistrationForm = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_FORM });
  }, []);

  return (
    <RegisterGrantContext.Provider 
      value={{
        state,
        dispatch,
        updateForm,
        validateField,
        handleRegisterSubmit,
        clearRegistrationForm
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