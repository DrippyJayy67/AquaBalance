// Authentication API service
// Try proxy first (for development with React proxy), fallback to direct HTTPS
const API_ENDPOINTS = {
  development: ['/api', 'https://localhost:7180/api'],
  production: ['https://localhost:7180/api']
};

const getCurrentApiUrls = () => {
  return API_ENDPOINTS[process.env.NODE_ENV] || API_ENDPOINTS.development;
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
      throw new AuthApiError(
        'Unable to connect to server. Please ensure the API server is running at https://localhost:7180 and that SSL certificates are trusted.',
        0,
        { originalError: lastError.message }
      );
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