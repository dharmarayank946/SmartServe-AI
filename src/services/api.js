// Central API Configuration & HTTP Client for SmartServe AI
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/**
 * Generic HTTP Fetch wrapper for FastAPI communication
 * Handles JSON parsing, network errors, timeouts, and friendly error messages.
 */
export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

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
