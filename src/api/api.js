import apisauce from 'apisauce';
import { Global } from '@theme';

const create = (baseURL = Global.API_URL) => {
    const api = apisauce.create({
        baseURL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: Global.connectTimeout,
    });

    function json(data) {
        return JSON.stringify(data);
    }

    function formData(data) {
        const str = [];
        for (const p in data) {
            const key = encodeURIComponent(p);
            const value = encodeURIComponent(data[p]);
            str.push(`${key}=${value}`);
        }
        return str.join('&');
    }

    const login = (data) => {
        return api.post('/auth/login', data);
    };
    const signup = (data) => {
        return api.post('/auth/signup', data);
    };
    const get_user = (data) => {
        return api.post('/get_user', data);
    };
    const get_new_requests = (data) => {
        return api.post('/get_new_requests', data);
    };
    const get_freelancer = (data) => {
        return api.post('/get_freelancer', data);
    };
    const get_ratings = (data) => {
        return api.post('/get_ratings', data);
    };


    return {
        login,
        signup,
        get_user,
        get_new_requests,
        get_freelancer,
        get_ratings,
    };
};

// let's return back our create method as the default.
export default {
    create,
};
