import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { 
  FaStore, FaHandHoldingHeart, FaSchool, FaHouseUser,
  FaTools, FaLightbulb, FaUserFriends, FaRandom, 
  FaHandHoldingUsd, FaUserPlus, FaLandmark 
} from 'react-icons/fa';

// Define your constants and initial state here
const ACTION_TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_REGISTRATION_ERRORS: 'SET_REGISTRATION_ERRORS',
  CLEAR_REGISTRATION_FORM: 'CLEAR_REGISTRATION_FORM',
  LOAD_GRANTS: 'LOAD_GRANTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  LOAD_SAVED_STATE: 'LOAD_SAVED_STATE',
  TOGGLE_MENU: 'TOGGLE_MENU',
  SET_SCROLLED: 'SET_SCROLLED',
  SET_LOADING_STATE: 'SET_LOADING_STATE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SEARCH_GRANTS: 'SEARCH_GRANTS',
  FILTER_GRANTS: 'FILTER_GRANTS',
  UPDATE_STATISTICS: 'UPDATE_STATISTICS'
};

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Predefined grant categories
const DEFAULT_GRANT_CATEGORIES = [
  { 
    icon: FaStore, 
    title: 'Business Grants', 
    path: '/business-grants', 
    count: 50000 
  },
  { 
    icon: FaHandHoldingHeart, 
    title: 'Nonprofit Grants', 
    path: '/nonprofit-grants', 
    count: 30000 
  },
  { 
    icon: FaSchool, 
    title: 'Education Grants', 
    path: '/education-grants', 
    count: 25000 
  },
  { 
    icon: FaHouseUser, 
    title: 'Housing Grants', 
    path: '/housing-grants', 
    count: 20000 
  },
  { 
    icon: FaTools, 
    title: 'Technical Innovation', 
    path: '/innovation-grants', 
    count: 15000 
  },
  { 
    icon: FaLightbulb, 
    title: 'Research Grants', 
    path: '/research-grants', 
    count: 10000 
  },
  { 
    icon: FaUserFriends, 
    title: 'Community Development', 
    path: '/community-grants', 
    count: 40000 
  },
  { 
    icon: FaHandHoldingUsd, 
    title: 'Financial Assistance', 
    path: '/financial-grants', 
    count: 35000 
  },
  { 
    icon: FaUserPlus, 
    title: 'Minority Grants', 
    path: '/minority-grants', 
    count: 22000 
  },
  { 
    icon: FaLandmark, 
    title: 'Government Grants', 
    path: '/government-grants', 
    count: 45000 
  }
];

const initialState = {
  user: null,
  isAuthenticated: false,
  registration: {
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      primaryPhone: '',
      mobilePhone: '',
      confirmMobilePhone: ''
    },
    errors: {}
  },
  grants: {},
  grantCategories: DEFAULT_GRANT_CATEGORIES,
  loading: false,
  error: null,
  notifications: [],
  searchQuery: '',
  loadingStates: {
    grants: false,
    search: false
  },
  filters: {},
  statistics: {
    recentApplications: {
      sevenDays: 5000,
      thirtyDays: 25000,
      ninetyDays: 75000
    }
  }
};

// Create the context before the provider
const GrantsContext = createContext();

// Custom hook to use the Grants Context
export const useGrantsContext = () => {
  const context = useContext(GrantsContext);
  if (!context) {
    throw new Error('useGrantsContext must be used within a GrantsProvider');
  }
  return context;
};

// Reducer function
const grantsReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return { ...state, user: action.payload, isAuthenticated: true };
    
    case ACTION_TYPES.LOGOUT:
      return { ...initialState };
    
    case ACTION_TYPES.SET_REGISTRATION_ERRORS:
      return { 
        ...state, 
        registration: { 
          ...state.registration, 
          errors: action.payload 
        } 
      };
    
    case ACTION_TYPES.CLEAR_REGISTRATION_FORM:
      return { 
        ...state, 
        registration: { 
          ...initialState.registration 
        } 
      };
    
    case ACTION_TYPES.LOAD_GRANTS:
      return { 
        ...state, 
        grants: { 
          ...state.grants, 
          [action.payload.category]: action.payload.grants 
        } 
      };
    
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ACTION_TYPES.ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [...(state.notifications || []), action.payload] 
      };
    
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return { 
        ...state, 
        notifications: (state.notifications || []).filter(
          notification => notification.id !== action.payload
        ) 
      };
    
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    
    case ACTION_TYPES.LOAD_SAVED_STATE:
      return { 
        ...state, 
        [action.payload.key]: action.payload.value 
      };
    
    case ACTION_TYPES.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ACTION_TYPES.SET_LOADING_STATE:
      return { 
        ...state, 
        loadingStates: { 
          ...state.loadingStates, 
          [action.payload.key]: action.payload.value 
        } 
      };
    
    default:
      return state;
  }
};

// Provider Component
const GrantsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(grantsReducer, initialState);

  // Utility functions
  const validators = {
    isValidEmail: (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  };

  const handleApiError = (error) => {
    if (error.response) {
      return error.response.data.message || 'An error occurred';
    }
    return error.message || 'An unexpected error occurred';
  };

  // API Service
  const apiService = {
    get: async (endpoint) => {
      const response = await axios.get(`/api${endpoint}`);
      return response.data;
    },
    
    post: async (endpoint, data, config = {}) => {
      const response = await axios.post(`/api${endpoint}`, data, config);
      return response.data;
    },
    
    patch: async (endpoint, data) => {
      const response = await axios.patch(`/api${endpoint}`, data);
      return response.data;
    },
    
    delete: async (endpoint) => {
      const response = await axios.delete(`/api${endpoint}`);
      return response.data;
    }
  };

  // Actions
  const actions = {
    logout: () => {
      dispatch({ type: ACTION_TYPES.LOGOUT });
    },

    validateRegistrationField: (name, value) => {
      const errors = { ...state.registration.errors };
      
      switch (name) {
        case 'firstName':
          if (!value.trim()) {
            errors[name] = 'First name is required';
          } else {
            delete errors[name];
          }
          break;
          
        case 'lastName':
          if (!value.trim()) {
            errors[name] = 'Last name is required';
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
          } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
            errors[name] = 'Please enter a valid 10-digit phone number';
          } else {
            delete errors[name];
          }
          break;
          
        case 'confirmMobilePhone':
          if (value && value !== state.registration.formData.mobilePhone) {
            errors[name] = 'Mobile phone numbers do not match';
          } else {
            delete errors[name];
          }
          break;
      }

      dispatch({
        type: ACTION_TYPES.SET_REGISTRATION_ERRORS,
        payload: errors
      });
    },

    handleRegisterSubmit: async (e) => {
      e.preventDefault();
      
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        
        const errors = {};
        const { formData } = state.registration;
        
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.primaryPhone) errors.primaryPhone = 'Primary phone is required';
        if (formData.mobilePhone && formData.mobilePhone !== formData.confirmMobilePhone) {
          errors.confirmMobilePhone = 'Mobile phone numbers do not match';
        }

        if (Object.keys(errors).length > 0) {
          dispatch({
            type: ACTION_TYPES.SET_REGISTRATION_ERRORS,
            payload: errors
          });
          throw new Error('Please correct the form errors');
        }

        const response = await apiService.post('/register', formData);
        
        dispatch({ type: ACTION_TYPES.LOGIN, payload: response.user });
        dispatch({ type: ACTION_TYPES.CLEAR_REGISTRATION_FORM });
        
        actions.addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Registration successful'
        });
        
      } catch (error) {
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: handleApiError(error)
        });
        actions.addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Registration failed'
        });
      } finally {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
      }
    },

    clearRegistrationForm: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_REGISTRATION_FORM });
    },
    
    loadGrants: async () => {
      // Early return if already loading or if grants are already loaded
      if (state.loadingStates.grants || Object.keys(state.grants).length > 0) return;
    
      try {
        dispatch({ 
          type: ACTION_TYPES.SET_LOADING_STATE, 
          payload: { key: 'grants', value: true } 
        });
        
        const grants = await apiService.get('/grants/all');
        
        dispatch({ 
          type: ACTION_TYPES.LOAD_GRANTS, 
          payload: { 
            category: 'all',
            grants: Array.isArray(grants) ? grants : [] 
          } 
        });
      } catch (error) {
        console.error('Error loading grants:', error);
        dispatch({ 
          type: ACTION_TYPES.LOAD_GRANTS, 
          payload: { category: 'all', grants: [] } 
        });
        
        // Only dispatch error if it's a real error, not a connection refused
        if (error.code !== 'ERR_CONNECTION_REFUSED') {
          dispatch({ 
            type: ACTION_TYPES.SET_ERROR, 
            payload: handleApiError(error) 
          });
        }
      } finally {
        dispatch({ 
          type: ACTION_TYPES.SET_LOADING_STATE, 
          payload: { key: 'grants', value: false } 
        });
      }
    },
    
    filterGrants: (filters) => {
      dispatch({ type: ACTION_TYPES.FILTER_GRANTS, payload: filters });
    },
    
    searchGrants: async (query) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING_STATE, payload: { key: 'search', value: true } });
        dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: query });
        const results = await apiService.get(`/grants/search?q=${query}`);
        dispatch({ type: ACTION_TYPES.SEARCH_GRANTS, payload: results });
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: handleApiError(error) });
      } finally {
        dispatch({ type: ACTION_TYPES.SET_LOADING_STATE, payload: { key: 'search', value: false } });
      }
    },
    
    addNotification: (notification) => {
      const id = Date.now(); // Generate unique ID
      const notificationWithId = { ...notification, id };
      
      dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notificationWithId });
      
      setTimeout(() => {
        actions.removeNotification(id);
      }, 5000);
    },
    
    removeNotification: (id) => {
      dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
    },
    
    clearNotifications: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATIONS });
    }
  };

  // Persist State Effects
  useEffect(() => {
    const savedState = localStorage.getItem('grantsState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        Object.entries(parsedState).forEach(([key, value]) => {
          dispatch({ 
            type: ACTION_TYPES.LOAD_SAVED_STATE, 
            payload: { key, value }
          });
        });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Auto-save state changes
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      grants: state.grants,
      searchQuery: state.searchQuery,
      filters: state.filters
    };
    
    localStorage.setItem('grantsState', JSON.stringify(stateToSave));
  }, [state.user, state.isAuthenticated, state.grants, state.searchQuery, state.filters]);

  // Return the provider with state and actions
  return (
    <GrantsContext.Provider value={{ state, actions, validators }}>
      {children}
    </GrantsContext.Provider>
  );
};

// Optional: A simple wrapper component for easier integration
export const GrantsContextWrapper = ({ children }) => {
  return (
    <GrantsProvider>
      {children}
    </GrantsProvider>
  );
};

export default GrantsProvider;