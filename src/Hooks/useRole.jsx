import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = "user",
    isLoading: roleLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const email = user?.email;
      if (!email) return "user";
      const res = await axiosSecure.get(`/users/${encodeURIComponent(email)}/role`);
      return res.data?.role || "user";
    },
    enabled: !!user?.email, 
    staleTime: 60_000,
    retry: 1,
  });
  return { role, roleLoading, isError, error, refetch };
};

export default useRole;
