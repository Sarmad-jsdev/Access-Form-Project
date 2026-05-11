import React from "react";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger", // danger | warning | success
}) => {
  if (!isOpen) return null;

  const styles = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    success: "bg-green-500 hover:bg-green-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* MODAL BOX */}
      <div className="relative w-full max-w-md mx-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-lg p-6 animate-fadeIn">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          {message}
        </p>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onCancel}
              aria-label="Cancel action"
            className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            aria-label="Confirm action"
            className={`px-4 py-2 rounded-lg text-sm text-[var(--text-on-primary)] cursor-pointer  transition ${styles[type]}`}
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;