// src/pages/Admin/ManageRequests.jsx
import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loading from "../../../components/Loader/Loader";

const MySwal = withReactContent(Swal);

const ManageRequest = () => {
  const api = useAxiosSecure();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["requests", "all"],
    queryFn: async () => {
      const res = await api.get("/requests?status=pending&limit=100");
      // API returns { requests, total }
      if (res?.data?.requests) return res.data.requests;
      if (Array.isArray(res?.data)) return res.data;
      return res.data.requests || [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const requests = data || [];

  const handleAction = async (requestId, action) => {
    const confirm = await MySwal.fire({
      title: action === "approve" ? "Approve request?" : "Reject request?",
      text: action === "approve" ? "This will update the user's role." : "This will mark the request as rejected.",
      theme:'dark',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "approve" ? "Yes, approve" : "Yes, reject",
    });

    if (!confirm.isConfirmed) return;

    try {
      MySwal.fire({ theme:'dark',title: action === "approve" ? "Approving..." : "Rejecting...", didOpen: () => { MySwal.showLoading(); }, allowOutsideClick: false });
      const res = await api.patch(`/requests/${requestId}`, { action });
      MySwal.close();

      if (res?.data) {
        await MySwal.fire({
          title: action === "approve" ? "Approved" : "Rejected",
          theme:'dark',
          text: action === "approve" ? "User role updated and request approved." : "Request rejected.",
          icon: "success",
        });
        qc.invalidateQueries({ queryKey: ["requests", "all"] });
        qc.invalidateQueries({ queryKey: ["user-doc", res?.data?.request?.userEmail] });
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (err) {
      console.error("Action error:", err);
      MySwal.close();
      await MySwal.fire("Error", err?.response?.data?.error || err?.message || "Failed to perform action", "error");
    }
  };

  if (isLoading) return <Loading></Loading>;
  if (isError) return <div className="t-accent p-6">Failed to load requests.</div>;

  return (
    <main className="min-h-screen b-g-main p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="header-text t-primary text-2xl mb-4">Manage Role Requests</h2>

        <div className="overflow-x-auto b-g-surface b-subtle rounded-lg p-4">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="t-accent text-left">User Name</th>
                <th className="t-accent text-left">User Email</th>
                <th className="t-accent">Type</th>
                <th className="t-accent">Status</th>
                <th className="t-accent">Requested At</th>
                <th className="t-accent">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center t-muted py-6">No pending requests</td>
                </tr>
              )}
              {requests.map((r) => {
                const isPending = r.requestStatus === "pending";
                return (
                  <tr key={r._id}>
                    <td className="t-primary">{r.userName}</td>
                    <td className="t-muted text-sm">{r.userEmail}</td>
                    <td className={`capitalize ${r.requestType === 'admin' ? 'text-red-500' : 'text-green-500'}`}>{r.requestType}</td>
                    <td className={`uppercase ${r.requestStatus === "pending" ? "t-accent" : "t-muted"}`}>{r.requestStatus}</td>
                    <td className="t-muted text-sm">{new Date(r.requestTime).toLocaleString()}</td>
                    <td className="flex gap-2">
                      <button
                        disabled={!isPending}
                        onClick={() => handleAction(r._id, "approve")}
                        className={`px-3 py-2 rounded-md text-sm ${isPending ? "b-g-accent text-black" : "opacity-60 b-subtle t-primary cursor-not-allowed"}`}
                      >
                        Accept
                      </button>
                      <button
                        disabled={!isPending}
                        onClick={() => handleAction(r._id, "reject")}
                        className={`px-3 py-2 rounded-md text-sm ${isPending ? "b-subtle t-primary" : "opacity-60 b-subtle t-primary cursor-not-allowed"}`}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ManageRequest;
