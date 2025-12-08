import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({children}) => {
    const { user, loading } = useAuth();

    if(loading){
        return <div>
            <span className='loading loading-ball text-center'></span>
        </div>
    }

    if(!user){
        return <Navigate to='/login'></Navigate>
    }
    return children;
};

export default PrivateRoutes;