import fs from "fs";
import path from "path";

export type LeadStage = "new" | "contacted" | "quoted" | "booked" | "completed" | "lost";

export interface Lead {
  id: string;
  capturedAt: string;
  transcript: string;
  name: string;
  contact: string;
  stage: LeadStage;
  needsFollowUp: boolean;
  scheduledDate: string | null;
  notes: string;
}

const DATA_FILE = path.join(process.cwd(), "crm-data.json");

export function readLeads(): Lead[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Lead[];
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), { encoding: "utf8", mode: 0o600 });
}

function extractContact(transcript: string): { name: string; contact: string } {
  const email = transcript.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] ?? "";
  const phone = transcript.match(/(\+?1?\s*[-.]?\s*\(?[0-9]{3}\)?\s*[-.]?\s*[0-9]{3}\s*[-.]?\s*[0-9]{4})/)?.[0] ?? "";
  const nameRaw = transcript.match(
    /(?:my name is|i'm|i am|this is|it's|name's|name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  )?.[1] ?? "";
  return {
    name: nameRaw,
    contact: email || phone,
  };
}

export function addLead(transcript: string): Lead {
  const leads = readLeads();
  const { name, contact } = extractContact(transcript);
  const lead: Lead = {
    id: crypto.randomUUID(),
    capturedAt: new Date().toISOString(),
    transcript,
    name,
    contact,
    stage: "new",
    needsFollowUp: true,
    scheduledDate: null,
    notes: "",
  };
  leads.unshift(lead);
  writeLeads(leads);
  return lead;
}

export function updateLead(id: string, updates: Partial<Omit<Lead, "id" | "capturedAt">>): Lead | null {
  const leads = readLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...updates };
  writeLeads(leads);
  return leads[idx];
}
