// CRM ONLY — shared utilities for CRM API routes and server components
import type { CustomerStatus, JobStatus, QuoteStatus, EmployeeStatus, CustomerSource, ServiceType, InteractionType } from "@prisma/client";

export function sanitize(val: unknown): string {
  return String(val ?? "").trim().slice(0, 5000);
}

export function ok<T>(data: T) {
  return Response.json({ success: true, data, error: null });
}

export function err(message: string, status = 400) {
  return Response.json({ success: false, data: null, error: message }, { status });
}

export const STATUS_LABELS: Record<CustomerStatus, string> = {
  LEAD: "Lead", BOOKED: "Booked", COMPLETED: "Completed", CANCELLED: "Cancelled", NO_SHOW: "No Show",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  SCHEDULED: "Scheduled", IN_PROGRESS: "In Progress", COMPLETED: "Completed", CANCELLED: "Cancelled", NO_SHOW: "No Show",
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  SENT: "Sent", ACCEPTED: "Accepted", DECLINED: "Declined", EXPIRED: "Expired",
};

export const EMP_STATUS_LABELS: Record<EmployeeStatus, string> = {
  ACTIVE: "Active", INACTIVE: "Inactive",
};

export const SOURCE_LABELS: Record<CustomerSource, string> = {
  WEBSITE_FORM: "Website Form", WEBSITE_CHAT: "Website Chat", PHONE_CALL: "Phone Call",
  REFERRAL: "Referral", GOOGLE: "Google", OTHER: "Other",
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  LOADING_UNLOADING: "Loading & Unloading", PACKING: "Packing", BOTH: "Both",
};

export const INTERACTION_LABELS: Record<InteractionType, string> = {
  CALL: "Call", TEXT: "Text", EMAIL: "Email", IN_PERSON: "In Person", NOTE: "Note",
};
