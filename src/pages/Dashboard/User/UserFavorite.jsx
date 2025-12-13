// src/pages/Favorites/FavoriteMeals.jsx
import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "../../../components/Loader/Loader";
import useAuth from "../../../Hooks/useAuth";
import useTitle from "../../../Hooks/useTitles";

const MySwal = withReactContent(Swal);

const FavoriteMeals = () => {
    useTitle('Favorites | ChefHut')
  const { user } = useAuth();
  const api = useAxiosSecure();
  const qc = useQueryClient();
  const email = user?.email;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorites", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/favorites?email=${encodeURIComponent(email)}`);
      // backend returns array
      return res.data || [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const favorites = data || [];

  // mutation: delete favorite
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/favorites/${id}`);
      return res.data;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["favorites", email] });
      const previous = qc.getQueryData(["favorites", email]);
      qc.setQueryData(["favorites", email], (old = []) => old.filter((f) => f._id !== id));
      return { previous };
    },
    onError: (err, variables, context) => {
      qc.setQueryData(["favorites", email], context.previous);
      MySwal.fire("Error", err?.response?.data?.error || "Failed to remove favorite", "error");
    },
    onSuccess: (data) => {
      MySwal.fire("Removed", "Meal removed from favorites successfully.", "success");
      qc.invalidateQueries({ queryKey: ["favorites", email] });
    },
  });

  const handleDelete = async (fav) => {
    const confirm = await MySwal.fire({
      title: "Remove favorite?",
      text: `Remove "${fav.mealName}" from your favorites?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });
    if (!confirm.isConfirmed) return;
    deleteMutation.mutate(fav._id);
  };

  if (!email) {
    return (
      <div className="min-h-screen b-g-main p-6">
        <div className="max-w-4xl mx-auto text-center t-muted">Please login to view favorites.</div>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="min-h-screen b-g-main p-6">
        <div className="max-w-4xl mx-auto text-center t-accent">Failed to load favorites.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen b-g-main p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="header-text t-primary text-2xl mb-4">Favorite Meals</h2>

        {favorites.length === 0 ? (
          <div className="b-g-surface b-subtle rounded-lg p-8 text-center t-muted">
            You don't have any favorite meals yet.
          </div>
        ) : (
          <div className="b-g-surface b-subtle rounded-lg overflow-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="t-accent">Meal Name</th>
                  <th className="t-accent">Chef Name</th>
                  <th className="t-accent">Price</th>
                  <th className="t-accent">Date Added</th>
                  <th className="t-accent">Action</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((f) => {
                  const date = f.addedTime ? new Date(f.addedTime).toLocaleString() : f.addedTime || "—";
                  return (
                    <tr key={f._id}>
                      <td className="t-primary">{f.mealName}</td>
                      <td className="t-muted">{f.chefName}</td>
                      <td className="t-primary"> {f.price ? `৳${f.price}` : "—"}</td>
                      <td className="t-muted text-sm">{date}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(f)}
                          className="px-3 py-1 rounded-md b-subtle t-primary hover:opacity-90"
                          disabled={deleteMutation.isLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default FavoriteMeals;
