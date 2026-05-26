// CRM ONLY
export function FormField({
  label, name, type = "text", value, onChange, required, placeholder, options, rows, hint, error,
}: {
  label: string; name: string; type?: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string; options?: { value: string; label: string }[];
  rows?: number; hint?: string; error?: string;
}) {
  const base = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white text-gray-900 " +
    (error ? "border-red-400" : "border-gray-200");

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options ? (
        <select name={name} value={value} onChange={e => onChange(e.target.value)} required={required} className={base}>
          <option value="">Select…</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : rows ? (
        <textarea name={name} value={value} onChange={e => onChange(e.target.value)}
          required={required} placeholder={placeholder} rows={rows} className={base + " resize-none"} />
      ) : (
        <input name={name} type={type} value={value} onChange={e => onChange(e.target.value)}
          required={required} placeholder={placeholder} className={base} />
      )}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
