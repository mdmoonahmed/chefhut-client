import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const MyMeals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedMeal, setSelectedMeal] = useState(null);

  const {
    data: meals = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-meals", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/meals/chef?email=${encodeURIComponent(user.email)}`
      );
      return res.data;
    },
  });

  // DELETE MEAL
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      theme: 'dark',
      text: "This meal will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C9A24D",
      cancelButtonColor: "#23232A",
      background: "#14141A",
      color: "#EAEAEA",
    });

    if (!result.isConfirmed) return;

    await axiosSecure.delete(`/meals/${id}`);
    refetch();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      theme: "dark",
      text: "Meal deleted successfully.",
      background: "#14141A",
      color: "#EAEAEA",
    });
  };

  // UPDATE MEAL
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedMeal = {
      foodName: form.foodName.value,
      price: Number(form.price.value),
      ingredients: form.ingredients.value.split(","),
      estimatedDeliveryTime: form.estimatedDeliveryTime.value,
    };

    await axiosSecure.patch(`/meals/${selectedMeal._id}`, updatedMeal);
    setSelectedMeal(null);
    refetch();

    Swal.fire({
      icon: "success",
      title: "Updated!",
      theme: 'dark',
      text: "Meal updated successfully.",
      background: "#14141A",
      color: "#EAEAEA",
    });
  };

  if (isLoading) {
    return <p className="t-muted text-center mt-10">Loading your meals...</p>;
  }

  return (
    <div className="b-g-main min-h-screen p-6">
      <h1 className="header-text text-3xl t-primary mb-6">
        My Meals
      </h1>

      {meals.length === 0 ? (
        <p className="t-muted">No meals created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="b-g-surface b-subtle rounded-xl overflow-hidden"
            >
              <img
                src={meal.foodImage}
                alt={meal.foodName}
                className="h-48 w-full object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="text-xl t-primary font-semibold">
                  {meal.foodName}
                </h2>

                <p className="t-muted text-sm">
                  Chef: <span className="t-primary">{meal.chefName}</span>
                </p>

                <p className="t-muted text-sm">
                  Chef ID: <span className="t-primary">{meal.chefId}</span>
                </p>

                <p className="t-muted text-sm">
                  Ingredients:{" "}
                  <span className="t-primary">
                    {meal.ingredients?.join(", ")}
                  </span>
                </p>

                <div className="flex justify-between">
                  <span className="t-accent font-bold">৳ {meal.price}</span>
                  <span className="t-muted">⭐ {meal.rating}</span>
                </div>

                <p className="t-muted text-sm">
                  Delivery Time: {meal.estimatedDeliveryTime}
                </p>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedMeal(meal)}
                    className="flex-1 border border-[#C9A24D] text-orange-300 hover:bg-[#C9A24D] hover:text-black rounded-lg py-2"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="flex-1 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-lg py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPDATE MODAL */}
      {selectedMeal && (
        <dialog open className="modal">
          <div className="modal-box b-g-surface b-subtle">
            <h3 className="header-text text-xl t-primary mb-4">
              Update Meal
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                name="foodName"
                defaultValue={selectedMeal.foodName}
                className="input w-full b-g-main t-primary"
              />

              <input
                name="price"
                type="number"
                defaultValue={selectedMeal.price}
                className="input w-full b-g-main t-primary"
              />

              <input
                name="ingredients"
                defaultValue={selectedMeal.ingredients.join(",")}
                className="input w-full b-g-main t-primary"
              />

              <input
                name="estimatedDeliveryTime"
                defaultValue={selectedMeal.estimatedDeliveryTime}
                className="input w-full b-g-main t-primary"
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#C9A24D] text-black py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMeal(null)}
                  className="flex-1 border b-subtle t-muted py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyMeals;
