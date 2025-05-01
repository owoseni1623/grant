import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

// Removed client-side enum mappings to prevent exposure
// Server will handle enum transformations

// Validation Utilities
const ValidationUtils = {
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  validatePhoneNumber: (phone) => {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
  },

  validateSSN: (ssn) => {
    const re = /^\d{3}-?\d{2}-?\d{4}$/;
    return re.test(ssn);
  },

  validateFundingAmount: (amount) => {
    return amount >= 75000 && amount <= 750000;
  }
};

// Initial Form Data Structure
const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  ssn: '',
  dateOfBirth: '',
  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  fundingType: '',
  fundingAmount: '',
  fundingPurpose: '',
  timeframe: '',
  idCardFront: null,
  idCardBack: null,
  termsAccepted: false,
  gender: '',
  ethnicity: '',
  employmentStatus: '',
  incomeLevel: '',
  educationLevel: '',
  citizenshipStatus: '',
  agreeToCommunication: false
};

// Create Context
const ApplicationFormContext = createContext(undefined);

// Provider Component
export const ApplicationFormProvider = ({ children }) => {
  // State Management
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState(null);

  // Enhanced Form Field Update Method
  const updateFormField = useCallback((field, value) => {
    // Secure handling of specific fields
    if (field === 'fundingAmount') {
      const cleanedValue = parseFloat(String(value).replace(/[^0-9.]/g, ''));
      setFormData(prev => ({
        ...prev,
        [field]: isNaN(cleanedValue) ? '' : Math.max(0, cleanedValue.toFixed(2))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear previous errors
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Step Navigation Methods
  const moveToNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const moveToPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Comprehensive Validation Method
  const validateCurrentStep = useCallback(() => {
    const stepValidations = {
      1: () => {
        const newErrors = {};
        
        // Required field validations for step 1
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.ssn.trim()) newErrors.ssn = 'SSN is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!ValidationUtils.validateEmail(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
        if (!formData.fundingType) newErrors.fundingType = 'Funding type is required';
        if (!formData.fundingAmount) newErrors.fundingAmount = 'Funding amount is required';
        if (!formData.fundingPurpose.trim()) newErrors.fundingPurpose = 'Funding purpose is required';
        if (!formData.timeframe) newErrors.timeframe = 'Timeframe is required';
        
        return newErrors;
      },
      2: () => {
        const newErrors = {};
        
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.ethnicity) newErrors.ethnicity = 'Ethnicity is required';
        if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
        if (!formData.incomeLevel) newErrors.incomeLevel = 'Income level is required';
        
        return newErrors;
      },
      3: () => {
        const newErrors = {};
        
        if (!formData.fundingType) newErrors.fundingType = 'Funding type is required';
        
        const fundingAmount = parseFloat(formData.fundingAmount);
        if (!formData.fundingAmount) {
          newErrors.fundingAmount = 'Funding amount is required';
        } else if (!ValidationUtils.validateFundingAmount(fundingAmount)) {
          newErrors.fundingAmount = 'Funding amount must be between $75,000 and $750,000';
        }
        
        if (!formData.fundingPurpose.trim()) newErrors.fundingPurpose = 'Funding purpose is required';
        
        return newErrors;
      },
      4: () => {
        const newErrors = {};
        
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
        
        // Validate file uploads
        if (!formData.idCardFront) newErrors.idCardFront = 'ID card front is required';
        if (!formData.idCardBack) newErrors.idCardBack = 'ID card back is required';
        
        return newErrors;
      }
    };

    const stepValidation = stepValidations[currentStep] 
      ? stepValidations[currentStep]() 
      : {};
    
    setErrors(stepValidation);
    
    return Object.keys(stepValidation).length === 0;
  }, [formData, currentStep]);

  // Secure Form Submission Method
  const submitForm = useCallback(async () => {
    if (!validateCurrentStep()) {
      return Promise.reject(new Error('Validation failed'));
    }
  
    setIsSubmitting(true);
    setErrors({});
    setSubmissionResponse(null);
  
    try {
      // Create FormData object
      const submissionFormData = new FormData();
      
      // Personal Info
      submissionFormData.append('firstName', formData.firstName || '');
      submissionFormData.append('lastName', formData.lastName || '');
      submissionFormData.append('ssn', formData.ssn || '');
      submissionFormData.append('dateOfBirth', formData.dateOfBirth || '');
      submissionFormData.append('email', formData.email || '');
      submissionFormData.append('phoneNumber', formData.phoneNumber || '');
      submissionFormData.append('gender', formData.gender || '');
      submissionFormData.append('ethnicity', formData.ethnicity || '');

      // Employment Info
      submissionFormData.append('employmentStatus', formData.employmentStatus || '');
      submissionFormData.append('incomeLevel', formData.incomeLevel || '');
      submissionFormData.append('educationLevel', formData.educationLevel || '');
      submissionFormData.append('citizenshipStatus', formData.citizenshipStatus || '');

      // Address Info
      submissionFormData.append('streetAddress', formData.streetAddress || '');
      submissionFormData.append('city', formData.city || '');
      submissionFormData.append('state', formData.state || '');
      submissionFormData.append('zip', formData.zip || '');

      // Funding Info
      submissionFormData.append('fundingType', formData.fundingType || '');
      submissionFormData.append('fundingAmount', formData.fundingAmount?.toString() || '');
      submissionFormData.append('fundingPurpose', formData.fundingPurpose || '');
      submissionFormData.append('timeframe', formData.timeframe || '');

      // Other Fields
      submissionFormData.append('agreeToCommunication', formData.agreeToCommunication?.toString() || 'false');
      submissionFormData.append('termsAccepted', formData.termsAccepted?.toString() || 'false');

      // Files - only append if they exist
      if (formData.idCardFront) {
        submissionFormData.append('idCardFront', formData.idCardFront);
      }
      if (formData.idCardBack) {
        submissionFormData.append('idCardBack', formData.idCardBack);
      }

      // For debugging - log the FormData entries
      for (let pair of submissionFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios({
        method: 'post',
        url: 'https://grant-api.onrender.com/api/grants/submit',
        data: submissionFormData,
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        withCredentials: false,
        timeout: 60000,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Allow us to see the error response
        }
      });

      if (response.status === 400) {
        throw new Error(JSON.stringify(response.data));
      }
  
      setSubmissionResponse(response.data);
      setIsSubmitting(false);
      return response.data;
  
    } catch (error) {
      console.error('Submission Error:', error);
      
      let errorMessage;
      if (error.response) {
        // Get detailed error message from response
        errorMessage = error.response.data.message || 
                      error.response.data.errors || 
                      JSON.stringify(error.response.data) ||
                      'Server validation failed';
        console.log('Detailed error response:', error.response.data);
      } else if (error.message) {
        try {
          // Try to parse the error message if it's JSON
          const parsedError = JSON.parse(error.message);
          errorMessage = parsedError.message || parsedError.errors || error.message;
        } catch {
          errorMessage = error.message;
        }
      } else {
        errorMessage = 'An unexpected error occurred';
      }
  
      setErrors(prev => ({
        ...prev,
        submission: typeof errorMessage === 'object' 
          ? JSON.stringify(errorMessage) 
          : errorMessage
      }));
  
      setIsSubmitting(false);
      throw error;
    }
}, [formData, validateCurrentStep]);

  // Reset Form Method
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    setIsSubmitting(false);
    setSubmissionResponse(null);
  }, []);

  // Context Value
  const contextValue = {
    formData,
    currentStep,
    errors,
    isSubmitting,
    submissionResponse,
    updateFormField,
    submitForm,
    moveToNextStep,
    moveToPreviousStep,
    resetForm,
    validateCurrentStep
  };

  return (
    <ApplicationFormContext.Provider value={contextValue}>
      {children}
    </ApplicationFormContext.Provider>
  );
};

// Custom Hook to Use Context
export const useApplicationForm = () => {
  const context = useContext(ApplicationFormContext);
  if (context === undefined) {
    throw new Error('useApplicationForm must be used within an ApplicationFormProvider');
  }
  return context;
};

// Simplified Enum Options (to be fetched from server)
export const FORM_ENUM_OPTIONS = {
  genderOptions: [], // Fetch from server
  ethnicityOptions: [], // Fetch from server
  employmentStatusOptions: [], // Fetch from server
  // ... other options
};