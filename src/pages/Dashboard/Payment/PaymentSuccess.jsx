import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentSuccess = () => {
    const [ searchParams] = useSearchParams();
    const api = useAxiosSecure();
    const session_id = searchParams.get('session_id');

    
    useEffect( () =>{
        if(session_id){
            api.patch(`payment-success?session_id=${session_id}`)
            .then(res => {
                console.log(res.data);
                
            })
        }
    },[session_id,api])
    return (
        <div>
            <h1>Payment Successful</h1>
        </div>
    );
};

export default PaymentSuccess;