import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useUser from "../../../Hooks/useUser";

const OrderRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { chefId } = useUser();

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["chef-orders", chefId],
    enabled: !!chefId,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/orders/chef?chefId=${encodeURIComponent(chefId)}`
      );
      return res.data;
    },
  });

  const updateStatus = async (id, status) => {
    await axiosSecure.patch(`/orders/${id}`, {
      orderStatus: status,
    });
    refetch();
  };

  const handleAction = async (order, status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Change order status to "${status}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#C9A24D",
      background: "#14141A",
      color: "#EAEAEA",
    });

    if (!result.isConfirmed) return;

    await updateStatus(order._id, status);

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `Order marked as ${status}`,
      background: "#14141A",
      color: "#EAEAEA",
    });
  };

  if (isLoading) {
    return <p className="t-muted text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="b-g-main min-h-screen p-6">
      <h1 className="header-text text-3xl t-primary mb-6">
        Order Requests
      </h1>

      {orders.length === 0 ? (
        <p className="t-muted">No orders yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => {
            const isPending = order.orderStatus === "pending";
            const isAccepted = order.orderStatus === "accepted";
            const isCancelled = order.orderStatus === "cancelled";
            const isDelivered = order.orderStatus === "delivered";

            return (
              <div
                key={order._id}
                className="b-g-surface b-subtle rounded-xl p-5 space-y-2"
              >
                <h2 className="t-primary text-xl font-semibold">
                  {order.mealName}
                </h2>

                <p className="t-muted text-sm">
                  User: <span className="t-primary">{order.userEmail}</span>
                </p>

                <p className="t-muted text-sm">
                  Address: {order.userAddress}
                </p>

                <div className="flex justify-between">
                  <span className="t-accent font-bold">
                    ৳ {order.price} × {order.quantity}
                  </span>
                  <span className="t-muted text-sm">
                    {new Date(order.orderTime).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="t-muted">
                    Status:{" "}
                    <span className="t-primary">{order.orderStatus}</span>
                  </span>
                  <span className="t-muted">
                    Payment:{" "}
                    <span className="t-primary">
                      {order.paymentStatus}
                    </span>
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 pt-4">
                  <button
                    disabled={!isPending}
                    onClick={() => handleAction(order, "cancelled")}
                    className={`flex-1 py-2 rounded-lg border 
                      ${
                        isPending
                          ? "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                  >
                    Cancel
                  </button>

                  <button
                    disabled={!isPending}
                    onClick={() => handleAction(order, "accepted")}
                    className={`flex-1 py-2 rounded-lg border 
                      ${
                        isPending
                          ? "border-[#C9A24D] text-orange-300 hover:bg-[#C9A24D] hover:text-black"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                  >
                    Accept
                  </button>

                  <button
                    disabled={!isAccepted}
                    onClick={() => handleAction(order, "delivered")}
                    className={`flex-1 py-2 rounded-lg border 
                      ${
                        isAccepted
                          ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                  >
                    Deliver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
