import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartrupee_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth Endpoints ---
export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const loginDemoUser = async () => {
  const response = await api.post('/auth/login', {
    email: 'ramesh.demo@smartrupee.in',
    password: 'DemoPassword123!',
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// --- Debt Advisory Endpoint ---
export const runDebtAnalysis = async (payload) => {
  const response = await api.post('/analyze', payload);
  return response.data;
};

export const getAnalysisHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

// --- Expense Tracking Endpoints ---
export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

export const getExpenses = async (limit = 30) => {
  const response = await api.get(`/expenses?limit=${limit}`);
  return response.data;
};

export const getExpenseSummary = async (days = 30) => {
  const response = await api.get(`/expenses/summary?days=${days}`);
  return response.data;
};

export const deleteExpense = async (expenseId) => {
  const response = await api.delete(`/expenses/${expenseId}`);
  return response.data;
};

export default api;
