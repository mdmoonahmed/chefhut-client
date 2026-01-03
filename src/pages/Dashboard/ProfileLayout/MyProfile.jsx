// src/pages/Profile/MyProfile.jsx
import React, { useEffect } from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loading from "../../../components/Loader/Loader";
import { GoDotFill } from "react-icons/go";
import useTitle from "../../../Hooks/useTitles";

const MySwal = withReactContent(Swal);

const MyProfile = () => {
  useTitle("My Profile | ChefHut");
  const { user } = useAuth();
  const api = useAxiosSecure();
  const qc = useQueryClient();

  // 1) fetch latest user doc from server
  const {
    data: userDoc,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user-doc", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await api.get(`/users/${encodeURIComponent(user.email)}`);
      return res.data;
    },
    enabled: !!user?.email,
    staleTime: 30_000,
  });

  // 2) fetch pending requests for this user (to decide button disable)
  const {
    data: pendingRequestsData = { requests: [] },
    isLoading: requestsLoading,
  } = useQuery({
    queryKey: ["my-requests", user?.email],
    queryFn: async () => {
      if (!user?.email) return { requests: [] };

      const res = await api.get(
        `/requests?userEmail=${encodeURIComponent(user.email)}&status=pending`
      );

      if (res?.data?.requests) return res.data;
      if (Array.isArray(res?.data)) return { requests: res.data };
      return { requests: res.data.requests || [] };
    },
    enabled: !!user?.email,
    staleTime: 30_000,
  });

  const pendingRequests = pendingRequestsData.requests || [];

  // helpers to check existing pending of type
  const hasPendingChefRequest = pendingRequests.some(
    (r) => r.requestType === "chef"
  );
  const hasPendingAdminRequest = pendingRequests.some(
    (r) => r.requestType === "admin"
  );

  // role from userDoc or fallback to 'user'
  const role = (userDoc && userDoc.role) || user?.role || "user";
  const userStatus = (userDoc && userDoc.status) || "active";

  // handle sending a request
  const sendRoleRequest = async (type) => {
    if (!user?.email) {
      MySwal.fire(
        "Not logged in",
        "Please login to send a request.",
        "warning"
      );
      return;
    }

    // confirmation
    const conf = await MySwal.fire({
      title: `Request to become ${type}`,
      text: `Are you sure you want to send a request to become a ${type}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, send request",
      customClass: {
        popup: "b-g-surface",
        title: "t-primary",
        content: "t-muted",
      },
    });

    if (!conf.isConfirmed) return;

    // build payload
    const payload = {
      userId: userDoc?._id || user.uid || null,
      userName: user.displayName || userDoc?.name || "",
      userEmail: user.email,
      requestType: type,
    };

    try {
      const res = await api.post("/requests", payload);
      // success
      MySwal.fire({
        title: "Request submitted",
        text: `Your request to become ${type} has been submitted and is pending review.`,
        icon: "success",
        customClass: {
          popup: "b-g-surface",
          title: "t-primary",
          content: "t-muted",
        },
      });

      // refresh pending requests and user doc (in case admin auto-changes)
      qc.invalidateQueries(["my-requests", user?.email]);
      qc.invalidateQueries(["user-doc", user?.email]);
    } catch (err) {
      console.error("POST /requests error:", err);
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to submit request";
      if (status === 409) {
        MySwal.fire("Already pending", msg, "info");
      } else {
        MySwal.fire("Error", msg, "error");
      }
    }
  };

  // Loading / error states
  if (userLoading) {
    return <Loading></Loading>;
  }

  if (userError) {
    return (
      <div className="min-h-screen b-g-main flex items-center justify-center p-4">
        <div className="t-accent">Failed to load profile.</div>
      </div>
    );
  }

  // snapshot fields (prefer server-side userDoc values)
  const displayName =
    userDoc?.displayName || user?.displayName || userDoc?.name || "Unnamed";
  const email = user?.email || userDoc?.email || "—";
  const image = userDoc?.photoURL || user?.photoURL || "/default-user.png";
  const address = userDoc?.address || user?.userAddress || "Not provided";
  const chefId = userDoc?.chefId || user?.chefId || null;

  return (
    <main className="min-h-screen b-g-main py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="b-g-surface b-subtle rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            {/* avatar */}
            <div className="w-32 flex-shrink-0">
              <img
                src={image}
                alt={displayName}
                className="w-32 h-32 object-cover rounded-xl border b-subtle"
              />
            </div>

            {/* details */}
            <div className="flex-1">
              <h2 className="header-text t-primary text-2xl">{displayName}</h2>
              <p className="t-muted text-sm mb-4">{email}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-md b-g-main">
                  <div className="t-muted text-xs">Address</div>
                  <div className="t-primary text-sm">{address}</div>
                </div>

                <div className="p-3 rounded-md b-g-main">
                  <div className="t-muted text-xs">Role</div>
                  <div className="t-primary text-sm capitalize">{role}</div>
                </div>

                <div className="p-3 rounded-md b-g-main">
                  <div className="t-muted text-xs">Status</div>
                  <div
                    className={`text-sm flex items-center gap-1 font-medium ${
                      userStatus === "fraud" ? "t-accent" : "t-primary"
                    }`}
                  >
                    {userStatus === "fraud" ? (
                      <GoDotFill className="text-red-500" />
                    ) : (
                      <GoDotFill className="text-green-500" />
                    )}{" "}
                    {userStatus}
                  </div>
                </div>

                <div className="p-3 rounded-md b-g-main">
                  <div className="t-muted text-xs">Chef ID</div>
                  <div className="t-primary text-sm">{chefId || "—"}</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                {/* Be a Chef */}
                {role !== "chef" && role !== "admin" && (
                  <button
                    onClick={() => sendRoleRequest("chef")}
                    disabled={hasPendingChefRequest}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      hasPendingChefRequest
                        ? "opacity-60 cursor-not-allowed b-subtle t-primary"
                        : "b-g-accent text-black"
                    }`}
                    title={
                      hasPendingChefRequest
                        ? "You already have a pending chef request"
                        : "Request to become a chef"
                    }
                  >
                    {hasPendingChefRequest
                      ? "Chef request pending"
                      : "Be a Chef"}
                  </button>
                )}

                {/* Be an Admin */}
                {role !== "admin" && (
                  <button
                    onClick={() => sendRoleRequest("admin")}
                    disabled={hasPendingAdminRequest || role === "chef"}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      hasPendingAdminRequest || role === "chef"
                        ? "opacity-60 cursor-not-allowed b-subtle t-primary"
                        : "b-subtle t-primary"
                    }`}
                    title={
                      hasPendingAdminRequest
                        ? "You already have a pending admin request"
                        : role === "chef"
                        ? "Chef accounts cannot directly request admin"
                        : "Request to become an admin"
                    }
                  >
                    {hasPendingAdminRequest
                      ? "Admin request pending"
                      : "Be an Admin"}
                  </button>
                )}
              </div>

              {/* Pending requests list (if any) */}
              {pendingRequests.length > 0 && (
                <div className="mt-6">
                  <h4 className="t-primary text-sm font-semibold mb-2">
                    Pending Requests
                  </h4>
                  <div className="space-y-2">
                    {pendingRequests.map((r) => (
                      <div
                        key={r._id || r.requestTime}
                        className="b-g-main b-subtle p-3 rounded-md"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="t-primary text-sm font-medium">
                              {r.requestType.toUpperCase()}
                            </div>
                            <div className="t-muted text-xs">
                              {new Date(r.requestTime).toLocaleString()}
                            </div>
                          </div>
                          <div className="t-muted text-sm">
                            {r.requestStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* small note */}
          <div className="mt-6 t-muted text-xs">
            Note: Requests are reviewed by admins. You will be notified when
            your role changes.
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
