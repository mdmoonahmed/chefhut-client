import React, { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useUser from "../../../Hooks/useUser";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useTitle from "../../../Hooks/useTitles";

const CreateMeal = () => {
    useTitle("Add Meal | ChefHut")
  const { user } = useAuth();
  const { role, status, chefId, displayName } = useUser();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  if (role !== "chef") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center t-accent">
        Only approved chefs can create meals.
      </div>
    );
  }

  if (status === "fraud") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Your account is restricted.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target;
      const imageFile = form.foodImage.files[0];

      // Image upload (example)
      const fd = new FormData();
      fd.append("image", imageFile);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbbApi}`,
        { method: "POST", body: fd }
      );
      const imgData = await imgRes.json();

      const meal = {
        foodName: form.foodName.value,
        chefName: displayName,
        foodImage: imgData.data.url,
        price: Number(form.price.value),
        rating: 0,
        ingredients: form.ingredients.value.split(",").map(i => i.trim()),
        estimatedDeliveryTime: form.deliveryTime.value,
        deliveryArea: form.deliveryArea.value,
        chefExperience: form.chefExperience.value,
        chefId,
        userEmail: user.email,
        createdAt: new Date(),
      };

      await axiosSecure.post("/meals", meal);

      toast.success("Meal created successfully");
      form.reset();
    } catch (err) {
      toast.error("Failed to create meal");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 b-g-main rounded-xl">
      <div className="b-g-surface border b-subtle rounded-2xl p-8 shadow-md">
        <h2 className="header-text t-accent text-3xl mb-6">Create New Meal</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <Input name="foodName" placeholder="Food Name" />
          <Input value={displayName} readOnly placeholder="Chef Name" />
          <FileInput name="foodImage" />
          <Input type="number" name="price" placeholder="Price" />
          <Textarea
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            colSpan
          />
          <Input name="deliveryTime" placeholder="Estimated Delivery Time" />
          <Input name="chefExperience" placeholder="Chef Experience" />
          <Input name="deliveryArea" placeholder="Delivery Area" />
          <Input value={user.email} readOnly />

          <button
            disabled={loading}
            className="md:col-span-2 mt-4 py-3 rounded-xl font-semibold b-g-accent text-black hover:brightness-105 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Add Meal"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ---------- Small UI Helpers ---------- */

const Input = ({ colSpan, ...props }) => (
  <input
    {...props}
    className={`
      w-full p-3 rounded-xl b-g-main border b-subtle t-primary
      focus:outline-none focus:border-orange-300
      ${colSpan ? "md:col-span-2" : ""}
    `}
  />
);

const Textarea = ({ colSpan, ...props }) => (
  <textarea
    {...props}
    rows="3"
    {...props}
    className={`
      w-full p-3 rounded-xl b-g-main border b-subtle t-primary
      focus:outline-none focus:border-t-accent
      ${colSpan ? "md:col-span-2" : ""}
    `}
  />
);

const FileInput = (props) => (
  <input
    type="file"
    accept="image/*"
    required
    {...props}
    className="w-full p-2 rounded-xl b-g-main border b-subtle t-muted"
  />
);

export default CreateMeal;
