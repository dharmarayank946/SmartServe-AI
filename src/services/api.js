// Central API Configuration & HTTP Client for SmartServe AI
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const IS_PRODUCTION = Boolean(import.meta.env.PROD);
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Retrieves the currently stored JWT access token from localStorage.
 * Does NOT hardcode or auto-generate credentials.
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Retrieves the stored authenticated user profile metadata.
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('smartserve_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

/**
 * Checks if a legitimate active user session token exists.
 */
export function isAuthenticated() {
  return Boolean(getAuthToken());
}

/**
 * Clears the user's authentication session and emits a logout notification.
 */
export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('smartserve_user');
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }
}

export const logout = clearAuthSession;

/**
 * Authenticates a user against the backend POST /api/v1/auth/login endpoint
 * using user-provided credentials.
 * Never hardcodes credentials or secrets.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{ success: boolean, token: string, user: object }>}
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Please provide both an email address and password.');
  }

  const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');
  const loginUrl = `${cleanBaseUrl}/api/v1/auth/login`;

  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: String(email).trim(),
      password: String(password),
    }),
  });

  if (!response.ok) {
    let errorDetail = 'Incorrect email or password.';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.error || errorDetail;
    } catch {
      errorDetail = `Authentication failed (HTTP ${response.status})`;
    }
    throw new Error(errorDetail);
  }

  const data = await response.json();
  if (data && data.access_token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      if (data.user) {
        localStorage.setItem('smartserve_user', JSON.stringify(data.user));
      }
      window.dispatchEvent(new CustomEvent('auth:login', { detail: data }));
    }
    return {
      success: true,
      token: data.access_token,
      user: data.user || null,
    };
  }

  throw new Error('Server returned an invalid authentication token.');
}

/**
 * Generic HTTP Fetch wrapper for FastAPI communication.
 * - Handles JSON parsing, network errors, and timeouts.
 * - Attaches Bearer JWT Authorization header when a valid token exists.
 * - Detects 401 Unauthorized, clears invalid tokens, and produces clear
 *   session-expired/sign-in error messages without infinite retry loops.
 */
export async function fetchApi(endpoint, options = {}) {
  const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const fullEndpoint = cleanEndpoint.startsWith('api/v1') ? cleanEndpoint : `api/v1/${cleanEndpoint}`;
  const url = `${cleanBaseUrl}/${fullEndpoint}`;

  const token = getAuthToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Handle FormData: remove Content-Type so browser sets multipart boundary
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

    // 401 Unauthorized: token missing, invalid, or expired
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.dispatchEvent(new CustomEvent('auth:unauthorized', {
          detail: { endpoint: cleanEndpoint }
        }));
      }

      const isLoginEndpoint = cleanEndpoint.includes('auth/login');
      const authMessage = isLoginEndpoint
        ? 'Incorrect email or password.'
        : 'Session expired or authentication required. Please sign in to access this feature.';

      throw new Error(authMessage);
    }

    if (!response.ok) {
      let serverDetail = '';
      try {
        const errorJson = await response.json();
        serverDetail = errorJson.detail || errorJson.error || JSON.stringify(errorJson);
      } catch {
        serverDetail = response.statusText;
      }
      throw new Error(serverDetail ? `${serverDetail} (HTTP ${response.status})` : `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null, success: true };
  } catch (err) {
    let friendlyMessage = err.message || 'Unable to reach backend service.';
    if (err.name === 'AbortError') {
      friendlyMessage = 'Connection request timed out. Please try again.';
    } else if (err.message && err.message.includes('Failed to fetch')) {
      friendlyMessage = 'FastAPI server offline or unreachable. Please verify backend is running on port 8000.';
    }

    return {
      data: null,
      error: friendlyMessage,
      originalError: err.message,
      success: false,
    };
  }
}
