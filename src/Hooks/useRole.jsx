import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth"
import useAxiosSecure from "./useAxiosSecure";

const useRole = () =>{
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: role = 'user',isLoading:roleLoading} = useQuery({
        queryKey:['user-role',user?.email],
        queryFn: async() =>{
          const res=  await axiosSecure.get(`/users/email=${user.email}/role`)
          return res.data?.role || 'user';
        }
    })
    return (role,roleLoading);
}

export default useRole;