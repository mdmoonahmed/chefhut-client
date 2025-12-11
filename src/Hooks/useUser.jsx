import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useUser = () => {
     const { user } = useAuth();
     const axiosSecure = useAxiosSecure();

  const {
    data,
    isLoading: roleLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const email = user?.email;
      if (!email) return;
      const res = await axiosSecure.get(`/users/${encodeURIComponent(email)}`);
      return res.data;
    },
    enabled: !!user?.email, 
    staleTime: 60_000,
    retry: 1,
  });
  const role = data?.role;
  const status = data?.status;
  const address = data?.address;
  const photoURL= data?.photoURL;
  const displayName = data?.displayName;
  const chefId = data?.chefId || 'N/A';
  
  return { role,status,address,photoURL,displayName,chefId, roleLoading, isError, error, refetch };
};

export default useUser;