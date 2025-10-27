// Authentication API service
// 
// CORS Configuration for Hosted Environments:
// This API service tries multiple endpoints to handle CORS issues when hosted:
// 1. Environment variable REACT_APP_API_URL (recommended for production)
// 2. Direct localhost access (requires backend CORS configuration)
// 3. CORS proxy service (requires activation)
// 
// For presentations from hosted environments (like AWS Amplify):
// - Set REACT_APP_API_URL environment variable to your backend URL, OR
// - Configure your backend API to allow CORS from your hosted domain, OR
// - Use the CORS proxy (visit cors-anywhere.herokuapp.com to activate)
//
// API endpoint configuration based on environment
const getApiBaseUrl = () => {
  // Check if we're in a hosted environment (Amplify, Netlify, etc.)
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Local development - use localhost with proxy fallback
    return process.env.NODE_ENV === 'development' ? ['/api', 'https://localhost:7180/api'] : ['https://localhost:7180/api'];
  } else {
    // Hosted environment - try multiple approaches for CORS
    const envApiUrl = process.env.REACT_APP_API_URL;
    
    const urls = [];
    
    // First try environment variable if set
    if (envApiUrl) {
      urls.push(envApiUrl);
    }
    
    // For presentation purposes, try localhost with CORS proxy
    // Note: This requires running the backend with CORS enabled for the hosted domain
    urls.push('https://localhost:7180/api');
    
    // Add CORS proxy as last resort (requires activation at cors-anywhere.herokuapp.com)
    urls.push('https://cors-anywhere.herokuapp.com/https://localhost:7180/api');
    
    return urls;
  }
};

const getCurrentApiUrls = () => {
  return getApiBaseUrl();
};

// Get auth token
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

class AuthApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.data = data;
  }
}

async function makeApiRequest(endpoint, options = {}) {
  const apiUrls = getCurrentApiUrls();
  let lastError;
  
  // Try each API URL until one works
  for (const baseUrl of apiUrls) {
    const url = `${baseUrl}${endpoint}`;
    
    // Get auth token if available
    const token = getAuthToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      console.log('Trying API request to:', url);
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new AuthApiError(
          data.message || data || `HTTP ${response.status}`,
          response.status,
          data
        );
      }

      console.log('API request successful:', data);
      return data;
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      lastError = error;
      
      if (error instanceof AuthApiError) {
        // If it's an API error (not network), don't try other URLs
        throw error;
      }
      
      // Continue to next URL for network errors
      continue;
    }
  }
  
  // If all URLs failed, throw the last error
  if (lastError) {
    if (lastError instanceof AuthApiError) {
      throw lastError;
    }
    
    // Handle specific error types
    if (lastError.name === 'TypeError' && lastError.message.includes('Failed to fetch')) {
      // Check if this might be a CORS issue
      const isHosted = !window.location.hostname.includes('localhost');
      
      if (isHosted) {
        throw new AuthApiError(
          'CORS Error: Unable to connect from hosted environment to localhost backend. For presentation purposes, please either:\n1. Set REACT_APP_API_URL to your deployed backend URL, or\n2. Run the backend with CORS enabled for your domain, or\n3. Use a local development server.',
          0,
          { originalError: lastError.message, corsIssue: true }
        );
      } else {
        throw new AuthApiError(
          'Unable to connect to server. Please ensure the API server is running at https://localhost:7180 and that SSL certificates are trusted.',
          0,
          { originalError: lastError.message }
        );
      }
    }
    
    throw new AuthApiError(
      'Network error or server unavailable. Please check if the backend server is running.',
      0,
      { originalError: lastError.message }
    );
  }
}

// Convert form data to API format
function mapFormDataToApiRequest(formData) {
  // Convert estimated usage to numeric value (take middle of range)
  let dailyUsage = 0.1; // default
  
  if (formData.estimatedDailyUsage) {
    const usageMap = {
      '0-500': 250,
      '501-1000': 750,
      '1001-2000': 1500,
      '2001-5000': 3500,
      '5000+': 7500
    };
    dailyUsage = usageMap[formData.estimatedDailyUsage] || 0.1;
  }

  return {
    username: formData.email, // Using email as username
    email: formData.email,
    password: formData.password,
    businessName: formData.businessName,
    businessType: formData.businessType,
    registrationNumber: formData.registrationNumber || '',
    operationalAddress: formData.operatingAddress,
    townShip: formData.township,
    primaryContactPerson: formData.contactPerson,
    phoneNumber: formData.phone,
    whatappNumber: formData.whatsapp || formData.phone,
    waterUsages: [
      {
        waterSource: formData.waterSource,
        dailyUsage: dailyUsage,
        wastewaterSystem: formData.hasWastewaterTreatment
      }
    ]
  };
}

export async function registerUser(formData) {
  const apiData = mapFormDataToApiRequest(formData);
  
  try {
    const result = await makeApiRequest('/Account/Register', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
    
    return {
      success: true,
      data: result,
      message: 'Registration successful'
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    return {
      success: false,
      error: error.message,
      status: error.status,
      data: error.data
    };
  }
}

export async function loginUser(email, password) {
  try {
    const result = await makeApiRequest('/Account/Login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });
    
    // Store authentication token if provided, otherwise use accountId as token
    if (result.token) {
      localStorage.setItem('authToken', result.token);
    } else if (result.accountId) {
      // If no token provided, use accountId as authentication indicator
      localStorage.setItem('authToken', `account_${result.accountId}`);
    }
    
    // Store complete user data including client information
    const userData = {
      accountId: result.accountId,
      username: result.username,
      accountEmail: result.accountEmail,
      client: result.client,
      message: result.message
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    return {
      success: true,
      data: result,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    
    return {
      success: false,
      error: error.message,
      status: error.status,
      data: error.data
    };
  }
}

// Logout function
export function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return { success: true };
}

// Check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  // User is authenticated if they have either a token or valid user data
  return !!(token || user);
}

// Get current user
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Export the error class for handling in components
export { AuthApiError };

const authApi = {
  registerUser,
  loginUser,
  logoutUser,
  isAuthenticated,
  getCurrentUser,
  getAuthToken,
};

export default authApi;