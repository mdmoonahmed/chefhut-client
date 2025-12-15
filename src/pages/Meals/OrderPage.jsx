// src/pages/Order/OrderPage.jsx
import React, { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import Loader from "../../components/Loader/Loader";
import useTitles from '../../Hooks/useTitles';
import useUser from "../../Hooks/useUser";

const MySwal = withReactContent(Swal);

const OrderPage = () => {
  const { status } = useUser();
  const api = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  

  // get mealId from query param ?mealId=...
  const params = new URLSearchParams(location.search);
  const mealId = params.get("mealId");


  // fetch meal data to auto fill
  const { data: meal, isLoading: mealLoading, isError: mealError } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: async () => {
      if (!mealId) return null;
      const res = await api.get(`/meals/${mealId}`);
      return res.data;
    },
    enabled: !!mealId,
    staleTime: 30_000,
  });
  
  useTitles(`${meal?.foodName} | Order | ChefHut`)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      mealName: "",
      price: 0,
      quantity: 1,
      chefId: "",
      userEmail: user?.email || "",
      userAddress: "",
    },
  });

  // when meal loaded, populate defaults
  useEffect(() => {
    if (meal) {
      setValue("mealName", meal.foodName || "");
      setValue("price", meal.price ?? 0);
      setValue("chefId", meal.chefId || "");
      setValue("quantity", 1);
      setValue("userEmail", user?.email || "");
    }
  }, [meal, setValue, user]);

  // quantity & price to compute total
  const price = Number(watch("price") || 0);
  const quantity = Number(watch("quantity") || 1);
  const totalPrice = useMemo(() => price * quantity, [price, quantity]);

  // if (!user) {
  //   // we redirect above; show loader briefly
  //   return <Loader />;
  // }

  if (mealLoading) return <Loader />;
  if (mealError || !meal) {
    return (
      <div className="min-h-screen b-g-main flex items-center justify-center">
        <div className="t-accent">Failed to load meal data.</div>
      </div>
    );
  }

  // submit handler
  const onSubmit = async (formData) => {
      // Prevent fraud
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
    // show confirmation with SweetAlert
    const confirmed = await MySwal.fire({
      title: `Your total price is ৳${totalPrice}`,
      text: "Do you want to confirm the order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
      customClass: { popup: "b-g-surface", title: "t-primary", content: "t-muted" },
    });

    if (!confirmed.isConfirmed) {
      return; 
    }

    //  payload to match  API
    const payload = {
      foodId: String(mealId),
      mealName: String(formData.mealName || meal.foodName || ""),
      price: Number(formData.price || meal.price || 0),
      quantity: Number(formData.quantity || 1),
      chefName: String(meal.chefName || ''),
      chefId: String(formData.chefId || meal.chefId || ""),
      estimatedDeliveryTime: String(meal.estimatedDeliveryTime || ''),
      paymentStatus: "Pending",  
      userEmail: String(formData.userEmail || user.email),
      userAddress: String(formData.userAddress),
      orderStatus: "pending", 
    };

    

    try {
      // show a small loading modal 
      MySwal.fire({
        title: "Placing your order...",
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
      });

      const res = await api.post("/orders", payload);

      MySwal.close();
      await MySwal.fire({
        title: "Order placed successfully!",
        text: `Your order id: ${res?.data?.insertedId || "N/A"}`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: { popup: "b-g-surface", title: "t-primary", content: "t-muted" },
      });

      // navigate 
      navigate("/dashboard");
    } catch (err) {
      console.error("Order error:", err);
      MySwal.close();
      await MySwal.fire({
        title: "Failed to place order",
        text: err?.response?.data?.error || "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { popup: "b-g-surface", title: "t-primary", content: "t-muted" },
      });
    }
  };

  return (
    <main className="min-h-screen b-g-main py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="b-g-surface b-subtle p-6 rounded-2xl shadow-md">
          <h2 className="header-text t-primary text-2xl mb-2">Confirm your order</h2>
          <p className="t-muted mb-6">Most fields are pre-filled. Enter delivery address and quantity to confirm.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* mealName (readonly) */}
            <div>
              <label className="t-muted text-sm block mb-1">Meal</label>
              <input
                readOnly
                {...register("mealName")}
                className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md"
              />
            </div>

            {/* price (readonly) */}
            <div>
              <label className="t-muted text-sm block mb-1">Price (single)</label>
              <input
                readOnly
                {...register("price")}
                className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md"
              />
            </div>

            {/* quantity */}
            <div>
              <label className="t-muted text-sm block mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                {...register("quantity", { required: true, min: 1 })}
                className="w-36 bg-transparent b-subtle t-primary px-4 py-2 rounded-md"
              />
              {errors.quantity && <p className="t-accent text-xs mt-1">Quantity is required (min 1).</p>}
            </div>

            {/* chefId (readonly, hidden or visible) */}
            <div>
              <label className="t-muted text-sm block mb-1">Chef ID</label>
              <input
                readOnly
                {...register("chefId")}
                className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md"
              />
            </div>

            {/* userEmail (readonly) */}
            <div>
              <label className="t-muted text-sm block mb-1">Your email</label>
              <input
                readOnly
                {...register("userEmail")}
                className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md"
              />
            </div>

            {/* userAddress */}
            <div>
              <label className="t-muted text-sm block mb-1">Delivery address</label>
              <textarea
                {...register("userAddress", { required: true, minLength: 5 })}
                placeholder="House 12, Road 7, Mirpur DOHS, Dhaka"
                className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md"
              />
              {errors.userAddress && <p className="t-accent text-xs mt-1">Delivery address is required.</p>}
            </div>

            {/* total price display */}
            <div className="flex items-center justify-between mt-4">
              <div className="t-muted">Total</div>
              <div className="t-accent font-semibold text-lg">৳{totalPrice}</div>
            </div>

            {/* confirm button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full b-g-accent text-black py-3 rounded-md font-semibold"
              >
                {isSubmitting ? "Processing..." : "Confirm order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default OrderPage;
