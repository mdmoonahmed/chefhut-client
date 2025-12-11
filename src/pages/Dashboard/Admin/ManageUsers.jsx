// src/pages/Admin/ManageUsers.jsx
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ManageUsers = () => {
  const api = useAxiosSecure();
  const qc = useQueryClient();

  // fetch users list
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/users?limit=500"); 
      if (res?.data?.users) return res.data.users;
      if (Array.isArray(res?.data)) return res.data;
      return res.data.users || [];
    },
    staleTime: 30_000,
  });

  const handleMakeFraud = async (user) => {
    if (!user || !user._id) return;

    // do not allow admin to be marked fraud
    if (user.role === "admin") {
      MySwal.fire("Forbidden", "You cannot mark an admin as fraud.", "warning");
      return;
    }

    const confirm = await MySwal.fire({
      title: `Mark ${user?.displayName || user?.email} as fraud?`,
      text: "This will set the user's status to 'fraud' and restrict certain actions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark fraud",
      cancelButtonText: "Cancel",
      customClass: { popup: "b-g-surface", title: "t-primary", content: "t-muted" },
    });

    if (!confirm.isConfirmed) return;

    try {
      MySwal.fire({ title: "Updating...", didOpen: () => MySwal.showLoading(), allowOutsideClick: false });

      // call server route to update status
      const res = await api.patch(`/users/${user._id}/status`, { status: "fraud" });

      MySwal.close();
      await MySwal.fire("Success", "User marked as fraud.", "success");

      // refresh users list
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      // optionally invalidate single user doc if used elsewhere
      qc.invalidateQueries({ queryKey: ["user-doc", user.email] });
    } catch (err) {
      console.error("Make fraud error:", err);
      MySwal.close();
      await MySwal.fire("Error", err?.response?.data?.error || err?.message || "Failed to update user", "error");
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen p-6 t-muted">Loading users...</div>;
  if (isError) return <div className="p-6 t-accent">Failed to load users.</div>;

  return (
    <main className="min-h-screen b-g-main p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="header-text t-primary text-2xl mb-4">Manage Users</h2>

        <div className="overflow-x-auto b-g-surface b-subtle rounded-lg p-4">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left t-accent">User Name</th>
                <th className="text-left t-accent">User Email</th>
                <th className="t-accent">Role</th>
                <th className="t-accent">Status</th>
                <th className="t-accent">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center t-muted py-6">No users found</td>
                </tr>
              )}

              {users.map((u) => {
                const isAdmin = u.role === "admin";
                const isFraud = u.status === "fraud";
                const showMakeFraud = !isAdmin && !isFraud; // only show if not admin and not already fraud

                return (
                  <tr key={u._id}>
                    <td className="t-primary">{u.displayName || u.name || "—"}</td>
                    <td className="t-muted text-sm">{u.email}</td>
                    <td className={` ${u.role ==='admin' && 'text-red-500'} ${u.role ==='chef' && 'text-green-500'} ${u.role === 'user' && 't-muted'} capitalize`}>{u.role || "user"}</td>
                    <td className={`${u.status === "fraud" ? "t-accent" : "t-primary"}`}>{u.status || "active"}</td>
                    <td>
                      {showMakeFraud ? (
                        <button
                          onClick={() => handleMakeFraud(u)}
                          className="px-3 py-2 rounded-md text-sm b-subtle t-primary hover:opacity-90"
                        >
                          Make Fraud
                        </button>
                      ) : (
                        <button disabled className="px-3 py-2 rounded-md text-sm opacity-60 b-subtle t-primary cursor-not-allowed">
                          {isFraud ? "Fraud" : "—"}
                        </button>
                      )}
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

export default ManageUsers;
