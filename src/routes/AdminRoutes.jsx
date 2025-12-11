import React from 'react';
import useRole from '../Hooks/useRole';
import useAuth from '../Hooks/useAuth';
import Loading from '../components/Loader/Loader';

const AdminRoutes = ({ children }) => {
    const { role,roleLoading} = useRole();
    const {  loading } = useAuth();
    
    
    if(roleLoading || loading){
        return <Loading></Loading>
    }
    if(role !== 'admin'){
        return <h1>Forbidden</h1>
    }

    return children

};

export default AdminRoutes;