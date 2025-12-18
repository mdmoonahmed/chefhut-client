import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import Forbidden from '../../../components/Forbidden/Forbidden';

const PaymentSuccess = () => {
    const [ searchParams] = useSearchParams();
    const api = useAxiosSecure();
    const session_id = searchParams.get('session_id');
    
    useEffect( () =>{
        if(session_id){
            api.patch(`payment-success?session_id=${session_id}`)
        }
    },[session_id,api])
    
    if(!session_id){
        return <Forbidden></Forbidden>
    }
    return (
        <div className='flex justify-center place-items-center pt-[50%] sm:pt-40'>
            <h1 className='t-primary  text-2xl'>Payment Successful</h1>
           <span className='text-green-500 text-2xl'><IoCheckmarkDoneCircle /></span>
        </div>
    );
};

export default PaymentSuccess;