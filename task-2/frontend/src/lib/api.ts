const API_URL =
  process.env.NODE_ENV === 'production'
    ? ''
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_URL}/api`;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'API request failed');
      }

      // Backend returns {success, message, data}, so we return just the data field
      return responseData.data as T;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(username: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Calculation endpoints
  async getAllCalculations() {
    return this.request('/calculations', {
      method: 'GET',
    });
  }

  async startCalculation(initialValue: number) {
    return this.request('/calculations/start', {
      method: 'POST',
      body: JSON.stringify({ initialValue }),
    });
  }

  async addOperation(parentId: string, operation: string, inputValue: number) {
    return this.request('/calculations/add-operation', {
      method: 'POST',
      body: JSON.stringify({ parentId, operation, inputValue }),
    });
  }

  async getCalculationTree(id: string) {
    return this.request(`/calculations/${id}`, {
      method: 'GET',
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
