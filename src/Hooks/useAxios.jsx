import axios from 'axios';
import React from 'react';


const axiosInstance = axios.create({
    baseURL: 'https://chef-hut-indol.vercel.app/'
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;