"use client";
// CRM ONLY
export function ConfirmDialog({ open, onConfirm, onCancel, title, message, danger = false }: {
  open: boolean; onConfirm: () => void; onCancel: () => void;
  title: string; message: string; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-heading font-bold text-brand-navy text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${danger ? "bg-red-600 hover:bg-red-700" : "bg-brand-orange hover:bg-brand-ember"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
