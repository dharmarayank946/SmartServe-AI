// Central API Configuration & HTTP Client for SmartServe AI
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const IS_PRODUCTION = Boolean(import.meta.env.PROD);
export const USE_MOCK_DATA = IS_PRODUCTION
  ? import.meta.env.VITE_USE_MOCK_DATA === 'true'
  : import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/**
 * Generic HTTP Fetch wrapper for FastAPI communication
 * Handles JSON parsing, network errors, timeouts, and friendly error messages.
 */
export async function fetchApi(endpoint, options = {}) {
  const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const fullEndpoint = cleanEndpoint.startsWith('api/v1') ? cleanEndpoint : `api/v1/${cleanEndpoint}`;
  const url = `${cleanBaseUrl}/${fullEndpoint}`;
  
  const token = localStorage.getItem('access_token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Handle FormData: remove Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }


  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null, success: true };
  } catch (err) {
    let friendlyMessage = 'Unable to reach backend service. Using offline operational mode.';
    if (err.name === 'AbortError') {
      friendlyMessage = 'Connection request timed out. Please try again.';
    } else if (err.message.includes('Failed to fetch')) {
      friendlyMessage = 'FastAPI server offline. Switched seamlessly to local AI simulation mode.';
    }

    return {
      data: null,
      error: friendlyMessage,
      originalError: err.message,
      success: false,
    };
  }
}
