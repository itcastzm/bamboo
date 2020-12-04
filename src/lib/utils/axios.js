import axios from 'axios';
import { message } from 'antd';


const instance = axios.create({
    // baseURL: 'https://some-domain.com/api/',
    timeout: 5000,
    // headers: { 'X-Custom-Header': 'foobar' }
});



// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // message.loading(content, [duration], onClose)
    message.loading('请求中 ... ');
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Do something with response data
    message.destroy();
    return response.data;
}, function (error) {
    // Do something with response error
    message.destroy();
    return Promise.reject(error);
});


export default instance;
