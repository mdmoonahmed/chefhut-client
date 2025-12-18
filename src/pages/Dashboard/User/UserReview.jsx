import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader/Loader";
import useTitle from "../../../Hooks/useTitles";

const MyReviews = () => {
    useTitle("My Reviews | ChefHut")
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingReview, setEditingReview] = useState(null);

  const {
    data: reviews = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-reviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/reviews/user?email=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });
  // console.log(reviews);
  

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete review?",
      theme:"dark",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/reviews/${id}`);
      Swal.fire({ title:"Deleted!",theme:"dark", text:"Review removed successfully.", icon:"success"});
      refetch();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedReview = {
      rating: Number(form.rating.value),
      comment: form.comment.value,
    };

    await axiosSecure.patch(
      `/reviews/${editingReview._id}`,
      updatedReview
    );

    Swal.fire({ title:"Updated",theme:"dark", text:"Review updated successfully.", icon:"success"});
    setEditingReview(null);
    refetch();
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen b-g-main py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="header-text t-primary text-3xl mb-6">
          My Reviews
        </h1>

        {reviews.length === 0 && (
          <p className="t-muted">You haven’t posted any reviews yet.</p>
        )}

        <div className="grid gap-5">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="b-g-surface b-subtle rounded-xl p-5 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="t-primary font-semibold text-lg">
                  {review.mealName || "Meal"}
                </h3>
                <span className="t-accent font-medium">
                  {review.rating} ⭐
                </span>
              </div>

              <p className="t-muted text-sm">
                {review.comment}
              </p>

              <p className="t-muted text-xs">
                {new Date(review.date).toLocaleDateString()}
              </p>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setEditingReview(review)}
                  className="px-3 py-1 rounded-md b-subtle b-g-accent text-black hover:brightness-110"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="px-3 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="b-g-surface b-subtle rounded-xl p-6 w-full max-w-md">
            <h3 className="t-primary text-xl mb-4">
              Update Review
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <select
                name="rating"
                defaultValue={editingReview.rating}
                className="w-full bg-transparent b-subtle t-primary p-2 rounded-md"
              >
                <option value="5">5 ⭐</option>
                <option value="4">4 ⭐</option>
                <option value="3">3 ⭐</option>
                <option value="2">2 ⭐</option>
                <option value="1">1 ⭐</option>
              </select>

              <textarea
                name="comment"
                defaultValue={editingReview.comment}
                className="w-full bg-transparent b-subtle t-primary p-3 rounded-md"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 b-subtle t-muted rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 b-g-accent text-black rounded-md font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
