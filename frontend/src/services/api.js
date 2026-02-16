import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Direct backend URL since we are running in prod mode in Docker
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            // Token might be expired
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
