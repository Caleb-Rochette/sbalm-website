"use client";

import { useState, FormEvent } from "react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  moveDate: string;
  moveSize: string;
  serviceType: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  phone: "",
  email: "",
  moveDate: "",
  moveSize: "",
  serviceType: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm(initialForm);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again or call us directly.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center flex flex-col items-center gap-4">
        <div className="text-5xl">✅</div>
        <h3 className="font-heading font-bold text-2xl text-green-800">
          Message Received!
        </h3>
        <p className="text-green-700 max-w-sm">
          Thanks for reaching out. We&apos;ll get back to you shortly. If you need
          to reach us immediately, call{" "}
          <a href="tel:2535233755" className="font-bold hover:underline">
            📞 253-523-3755
          </a>
          .
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-green-600 underline hover:text-green-800"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full border border-brand-stoneLight rounded-xl px-4 py-3 text-sm bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-brand-mist";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-brand-navy mb-1.5">
            Full Name <span className="text-brand-error">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-1.5">
            Phone Number <span className="text-brand-error">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="253-555-0100"
            className={inputClass}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-1.5">
          Email Address <span className="text-brand-error">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="jane@example.com"
          className={inputClass}
        />
      </div>

      {/* Move Date + Move Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="moveDate" className="block text-sm font-semibold text-brand-navy mb-1.5">
            Desired Move Date <span className="text-brand-error">*</span>
          </label>
          <input
            id="moveDate"
            name="moveDate"
            type="date"
            required
            value={form.moveDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="moveSize" className="block text-sm font-semibold text-brand-navy mb-1.5">
            Home Size <span className="text-brand-error">*</span>
          </label>
          <select
            id="moveSize"
            name="moveSize"
            required
            value={form.moveSize}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="" disabled>
              Select size…
            </option>
            <option value="Studio/1BR">Studio / 1 Bedroom</option>
            <option value="2BR">2 Bedroom</option>
            <option value="3BR">3 Bedroom</option>
            <option value="4BR+">4 Bedroom or larger</option>
            <option value="Commercial">Commercial / Office</option>
          </select>
        </div>
      </div>

      {/* Service Type */}
      <div>
        <label htmlFor="serviceType" className="block text-sm font-semibold text-brand-navy mb-1.5">
          Service Needed <span className="text-brand-error">*</span>
        </label>
        <select
          id="serviceType"
          name="serviceType"
          required
          value={form.serviceType}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="" disabled>
            Select service…
          </option>
          <option value="Loading & Unloading">Loading &amp; Unloading</option>
          <option value="Packing">Packing Services</option>
          <option value="Both">Both Packing &amp; Loading/Unloading</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-brand-navy mb-1.5">
          Additional Notes
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Stairs? Heavy items? Anything we should know about your move…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Error state */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-4 px-8 rounded-xl hover:bg-brand-ember disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-base"
      >
        {status === "loading" ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending…
          </>
        ) : (
          "Send Request"
        )}
      </button>
      <p className="text-xs text-brand-stone text-center">
        Fields marked <span className="text-brand-error">*</span> are required. We typically respond within a few hours.
      </p>
    </form>
  );
}
