import React from 'react';
import useUser from '../../../Hooks/useUser';

const Statistic = () => {
    const {status} = useUser();
    return (
        <div className='text-white'>
            {status}
           Statistic 
        </div>
    );
};

export default Statistic;