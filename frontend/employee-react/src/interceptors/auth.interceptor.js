import axios from 'axios';

// // for intercepting requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// // for intercepting responses
axios.interceptors.response.use(
    (response) => {
        // // do something with the response
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axios;
