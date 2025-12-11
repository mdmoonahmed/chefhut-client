// src/pages/Meals/MealDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import useUser from "../../Hooks/useUser";
import Swal from "sweetalert2";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

const MealDetails = () => {
  const { status } = useUser();
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();

  // favorite UI state
  const [favLoading, setFavLoading] = useState(false);
  const [favMessage, setFavMessage] = useState("");

  /****Meal Query*****/
  const {
    data: meal,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await api.get(`/meals/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 30_000,
  });

  /********Review Query*******/
  const { data: reviewData = { reviews: [] }, refetch } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await api.get(`/reviews?foodId=${id}`);
      return res.data;
    },
    enabled: !!id,
  });
  const reviews = reviewData.reviews || [];

  useEffect(() => {
    if (meal?.foodName) {
      document.title = `${meal.foodName} — ChefHUt`;
    }
  }, [meal]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const comment = form.comment.value;
    const rating = form.rating.value;

    if (!comment || !rating) return;

    const reviewDoc = {
      foodId: id,
      reviewerName: user?.displayName || "Anonymous",
      reviewerImage: user?.photoURL || "",
      rating: Number(rating),
      comment,
    };

    await api.post("/reviews", reviewDoc);
    toast.success("Review submitted successfully", {
      theme: "dark",
    });
    form.reset();
    refetch();
  };

  // ---------- Favorites handler ----------
  const handleAddFavorite = async () => {
    if (!meal) return;

    setFavLoading(true);
    setFavMessage("");

    const payload = {
      userEmail: user.email,
      mealId: String(id),
      mealName: meal.foodName || "",
      chefId: String(meal.chefId || ""),
      chefName: meal.chefName || "",
      price: Number(meal.price || 0),
    };

    try {
      const res = await api.post("/favorites", payload);
      toast.success("Added to favorites❤️", {
        theme: "dark",
      });
      // success
      setFavMessage("Added to favorites ❤️");
    } catch (err) {
      // handle duplicate (unique index)
      const status = err?.response?.status;
      if (status === 409) {
        setFavMessage("This meal is already in your favorites.");
      } else {
        setFavMessage("Failed to add favorite. Try again.");
        console.error("Add favorite error:", err);
      }
    } finally {
      setFavLoading(false);
      setTimeout(() => setFavMessage(""), 3000);
    }
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  if (isError) {
    return (
      <div className="min-h-screen b-g-main flex items-center justify-center">
        <div className="t-accent">
          Failed to load meal: {String(error?.message || "")}
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen b-g-main flex items-center justify-center">
        <div className="t-accent">Meal not found.</div>
      </div>
    );
  }

  const {
    foodName,
    chefName,
    foodImage,
    price,
    rating,
    ingredients = [],
    deliveryArea,
    estimatedDeliveryTime,
    chefExperience,
    chefId,
    createdAt,
  } = meal;

  const handleOrderNow = () => {
    if (status === "fraud") {
      return Swal.fire({
        icon: "error",
        theme: 'dark',
        title: "Unauthorized Action",
        text: "You do not have the necessary permissions to perform this action",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545", 
        allowOutsideClick: false, 
      });
    }
    navigate(`/order?mealId=${id}`);
  };

  return (
    <main className="min-h-screen b-g-main py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Image */}
        <div className="md:col-span-1">
          <div className="b-g-surface b-subtle rounded-2xl overflow-hidden">
            <img
              src={foodImage}
              alt={foodName}
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex gap-3">
              <button
                onClick={handleOrderNow}
                className="w-full b-g-accent text-black hover:brightness-105 transition 1s py-2 rounded-md font-semibold"
              >
                Order Now
              </button>
            </div>

            {/* Favorite button */}
            <div className="mt-2">
              <button
                onClick={handleAddFavorite}
                disabled={favLoading}
                className={`w-full ${
                  favLoading ? "opacity-60 cursor-not-allowed" : ""
                } b-subtle t-primary py-2 rounded-md`}
              >
                {favLoading ? "Adding..." : "Add to Favorites"}
              </button>

              {favMessage && (
                <p className="t-accent text-sm mt-2 text-center">
                  {favMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <section className="md:col-span-2 space-y-6">
          <header>
            <h1 className="header-text t-primary text-3xl">{foodName}</h1>
            <p className="t-muted mt-1 text-sm">
              Added: {createdAt ? formatDate(createdAt) : "—"}
            </p>
          </header>

          {/* Top meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-4 items-center">
              <div className="t-accent font-semibold text-lg">৳{price}</div>
              <div className="t-muted">{rating} ⭐</div>
              {estimatedDeliveryTime && (
                <div className="t-muted">• {estimatedDeliveryTime}</div>
              )}
            </div>

            <div className="t-muted text-sm">
              <span className="t-primary font-semibold">Chef:</span> {chefName}{" "}
              <span className="t-muted">({chefId})</span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="b-g-surface b-subtle p-4 rounded-lg">
            <h3 className="t-primary font-semibold mb-2">Ingredients</h3>
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="t-muted text-sm px-3 py-1 rounded-full b-g-main"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            ) : (
              <div className="t-muted text-sm">No ingredients listed.</div>
            )}
          </div>

          {/* Delivery & Chef Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="b-g-surface b-subtle p-4 rounded-lg">
              <h4 className="t-primary font-semibold mb-2">Delivery Area</h4>
              <p className="t-muted text-sm">
                {deliveryArea || "Not specified"}
              </p>
            </div>

            <div className="b-g-surface b-subtle p-4 rounded-lg">
              <h4 className="t-primary font-semibold mb-2">
                Chef’s Experience
              </h4>
              <p className="t-muted text-sm">
                {chefExperience || "Not specified"}
              </p>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <div className="b-g-surface b-subtle p-5 rounded-lg space-y-4">
          <h3 className="header-text t-primary text-xl">
            Customer Reviews ({reviews.length})
          </h3>

          {/* Show reviews */}
          {reviews.length === 0 && (
            <p className="t-muted text-sm">No reviews yet.</p>
          )}

          <div className="space-y-4">
            {reviews.map((rev, index) => (
              <div key={index} className="b-g-main b-subtle p-3 rounded-md">
                <div className="flex items-center gap-3 mb-1">
                  {rev.reviewerImage && (
                    <img
                      src={rev.reviewerImage}
                      alt={rev.reviewerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="t-primary text-sm font-semibold">
                      {rev.reviewerName}
                    </p>
                    <p className="t-muted text-xs">
                      {rev.rating} ⭐ • {formatDate(rev.date)}
                    </p>
                  </div>
                </div>
                <p className="t-muted text-sm">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Review */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-3 pt-4">
              <textarea
                name="comment"
                placeholder="Write your review..."
                className="w-full bg-transparent b-subtle t-primary p-3 rounded-md focus:outline-none"
              />

              <select
                name="rating"
                className="w-full b-g-surface b-subtle t-primary p-2 rounded-md focus:outline-none"
              >
                <option value="">Rating</option>
                <option value="5">5 ⭐</option>
                <option value="4">4 ⭐</option>
                <option value="3">3 ⭐</option>
                <option value="2">2 ⭐</option>
                <option value="1">1 ⭐</option>
              </select>

              <button
                type="submit"
                className="b-g-accent text-black px-4 py-2 rounded-md font-semibold"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p className="t-muted text-sm">
              Please{" "}
              <span
                className="t-accent cursor-pointer"
                onClick={() => navigate("/login")}
              >
                login
              </span>{" "}
              to write a review.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default MealDetails;
