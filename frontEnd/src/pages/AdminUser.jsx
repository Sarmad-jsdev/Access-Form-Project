import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";
import DashboardLayout from "../Components/DashboardLayout";
import ConfirmModal from "../Components/ConfirmModal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [modal, setModal] = useState({
    open: false,
    type: null, // "block" | "delete"
    user: null,
  });

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        setUsers(res.data.users.filter((u) => u.role !== "admin"));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // OPEN BLOCK MODAL
  const handleBlockClick = (user) => {
    setModal({
      open: true,
      type: "block",
      user,
    });
  };

  // OPEN DELETE MODAL
  const handleDeleteClick = (user) => {
    setModal({
      open: true,
      type: "delete",
      user,
    });
  };

  // CONFIRM ACTION
  const handleConfirm = async () => {
    const user = modal.user;

    try {
      // BLOCK / UNBLOCK
      if (modal.type === "block") {
        await axiosInstance.put(`/admin/block/${user._id}`);

        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  status: u.status === "active" ? "blocked" : "active",
                }
              : u,
          ),
        );

        toast.success(
          user.status === "blocked" ? "User unblocked" : "User blocked",
        );
      }

      // DELETE
      if (modal.type === "delete") {
        await axiosInstance.delete(`/admin/delete/${user._id}`);

        setUsers((prev) => prev.filter((u) => u._id !== user._id));

        toast.success("User deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setModal({ open: false, type: null, user: null });
    }
  };

  // CANCEL MODAL
  const handleCancel = () => {
    setModal({ open: false, type: null, user: null });
  };

  return (
    <DashboardLayout title="Users">
      {/* LOADING */}
      {loading ? (
        <p className="text-sm text-[var(--text-secondary)]">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">No users found</p>
      ) : (
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {/* HEADER */}
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              All Users
            </h2>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition"
                  >
                    <td className="px-5 py-3 font-medium text-[var(--text-primary)]">
                      {u.name}
                    </td>

                    <td className="px-5 py-3 text-[var(--text-secondary)]">
                      {u.email}
                    </td>

                    <td className="px-5 py-3 capitalize text-[var(--text-secondary)]">
                      {u.role}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-3">
                      {u.status === "blocked" ? (
                        <span
                          aria-label="User is blocked"
                          className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600"
                        >
                          Blocked
                        </span>
                      ) : (
                        <span
                          aria-label="User is active"
                          className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600"
                        >
                          Active
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-3 flex gap-2">
                      {/* BLOCK / UNBLOCK */}
                      <button
                        onClick={() => handleBlockClick(u)}
                        className={`text-xs px-3 py-1.5 rounded-lg text-white font-medium cursor-pointer transition ${
                          u.status === "blocked"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        aria-label={`${u.status === "blocked" ? "Unblock" : "Block"} user`}
                      >
                        {u.status === "blocked" ? "Unblock" : "Block"}
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDeleteClick(u)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-black text-white font-medium cursor-pointer transition"
                        aria-label="Delete user"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={modal.open}
        title={
          modal.type === "delete"
            ? "Delete User"
            : modal.user?.status === "blocked"
              ? "Unblock User"
              : "Block User"
        }
        message={
          modal.type === "delete"
            ? "This user will be permanently deleted."
            : "Are you sure you want to " +
              (modal.user?.status === "blocked" ? "unblock" : "block") +
              " this user?"
        }
        confirmText="Yes, Continue"
        type={modal.type === "delete" ? "danger" : "warning"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DashboardLayout>
  );
};

export default AdminUsers;
