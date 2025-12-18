
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "../../../components/Loader/Loader";
import useAuth from "../../../Hooks/useAuth";
import useTitle from "../../../Hooks/useTitles";

const MySwal = withReactContent(Swal);

const MyOrders = () => {
    useTitle('My Orders | ChefHut');
  const  { user } = useAuth();
  const api = useAxiosSecure();
  const navigate = useNavigate();

  const email = user?.email || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-orders", email],
    queryFn: async () => {
      if (!email) return [];
      const res = await api.get(`/orders?email=${encodeURIComponent(email)}`);
      // support both shapes: { orders: [...] } or array
      if (res?.data?.orders) return res.data.orders;
      if (Array.isArray(res?.data)) return res.data;
      return res.data.orders || [];
    },
    enabled: !!email,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const orders = data || [];

  const handlePay = async (order) => {
    const price = Number(order.price ?? 0);
    const qty = Number(order.quantity ?? 1);
    const total = price * qty;

    const confirm = await MySwal.fire({
      title: `Your total price is ৳${total}`,
      theme: 'dark',
      text: "Do you want to confirm and proceed to payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, pay",
      cancelButtonText: "Cancel",
      customClass: { popup: "b-g-surface", title: "t-primary", content: "t-muted" },
    });

    if (!confirm.isConfirmed) return;

    const paymentInfo = {
       foodId: order._id,
       mealName: order.mealName,
       price: total,
       email: email,
    }

    // send paymentInfo to server
     const res =await api.post('/create-checkout-session',paymentInfo);
    //  console.log(res.data);
     

    // navigate to payment route 
     window.location.href=res.data.url;
  };

  if (!email) {
    return (
      <main className="min-h-screen b-g-main py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="t-muted">Please log in to view your orders.</div>
        </div>
      </main>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <main className="min-h-screen b-g-main py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="t-accent">Failed to load orders. Please try again later.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen b-g-main py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="header-text t-primary text-2xl">My Orders</h1>
          <p className="t-muted mt-1">All orders placed using {email}.</p>
        </header>

        {orders.length === 0 ? (
          <div className="b-g-surface b-subtle rounded-lg p-8 text-center">
            <p className="t-muted">You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((o) => {
              // normalize fields
              const {
                _id,
                mealName,
                price,
                quantity,
                orderStatus,
                paymentStatus,
                orderTime,
                deliveryTime,
                deliveryTimeEstimated,
                chefName,
                chefId,
                estimatedDeliveryTime,
              } = o;

              const qty = Number(quantity || 1);
              const unitPrice = Number(price || 0);
              const totalPrice = unitPrice * qty;

              const statusStr = (orderStatus || "pending").toLowerCase();
              const payPending =
                statusStr === "accepted" &&
                String(paymentStatus || "").toLowerCase() === "pending";

              return (
                <article key={_id} className="b-g-surface b-subtle rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="t-primary text-lg font-semibold">{mealName}</h3>
                      <p className="t-muted text-sm mt-1">{chefName} • {chefId}</p>
                    </div>
                    <div className="text-right">
                      <div className="t-muted text-xs">Order</div>
                      <div className="t-primary font-semibold">{new Date(orderTime || Date.now()).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="t-muted text-xs">Status</div>
                      <div className={`uppercase font-medium ${statusStr === "delivered" ? "t-accent" : "t-primary"}`}>{orderStatus}</div>
                    </div>

                    <div>
                      <div className="t-muted text-xs">Payment</div>
                      <div className="t-primary">{paymentStatus}</div>
                    </div>

                    <div>
                      <div className="t-muted text-xs">Price (unit)</div>
                      <div className="t-primary">৳{unitPrice}</div>
                    </div>

                    <div>
                      <div className="t-muted text-xs">Quantity</div>
                      <div className="t-primary">{qty}</div>
                    </div>

                    <div className="col-span-2">
                      <div className="t-muted text-xs">Estimated delivery</div>
                      <div className="t-primary text-sm">
                        {estimatedDeliveryTime || deliveryTime || deliveryTimeEstimated || "Not specified"}
                      </div>
                    </div>

                    <div className="col-span-2 mt-2 flex items-center justify-between">
                      <div className="t-muted text-sm">Total</div>
                      <div className="t-accent font-semibold">৳{totalPrice}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    {payPending ? (
                      <button
                        onClick={() => handlePay(o)}
                        className="flex-1 b-g-accent text-black py-2 rounded-md font-semibold"
                      >
                        Pay ৳{totalPrice}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 b-subtle t-primary py-2 rounded-md font-semibold opacity-60 cursor-not-allowed"
                      >
                        {paymentStatus === "Paid" || String(paymentStatus).toLowerCase() === "paid" ? "Paid" : "No payment"}
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/mealDetails/${o.foodId || o.foodId}`)}
                      className="px-4 py-2 b-subtle t-primary rounded-md"
                    >
                      View Meal
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
