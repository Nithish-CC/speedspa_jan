import axios from 'axios'

axios.defaults.baseURL = 'http://demo-api.savantsaloncrm.com/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['x-allow'] = 'admin';
axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.common['x-mothership-key'] = 'X MOTHERSHIP KEY';

axios.interceptors.request.use(request => {
    return request;
}, error => {
    return Promise.reject(error);
})

axios.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
})