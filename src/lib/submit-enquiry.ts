import { site } from '@/data/site';

export type EnquiryKind = 'enquiry' | 'rfq';

export interface EnquiryField {
  name: string;
  label: string;
  value: string;
}

export interface EnquiryPayload {
  kind: EnquiryKind;
  fields: EnquiryField[];
  page: string;
}

export interface SubmitResult {
  ok: boolean;
  /** True when the enquiry has actually reached Antrrow (e.g. via an API). */
  delivered: boolean;
  error?: string;
}

/**
 * Single integration point for enquiry delivery.
 * There is no mail backend yet, so this resolves without delivering and the UI asks the
 * visitor to send the prepared message by email or WhatsApp. Replace the body with a
 * fetch() to an API (Resend, Web3Forms, etc.) and return `delivered: true` on success.
 */
export async function submitEnquiry(_payload: EnquiryPayload): Promise<SubmitResult> {
  return { ok: true, delivered: false };
}

const subjectFor = (payload: EnquiryPayload) => {
  const company = payload.fields.find((f) => f.name === 'company')?.value;
  const category = payload.fields.find((f) => f.name === 'category')?.value;
  const base = payload.kind === 'rfq' ? 'Request for Quotation' : 'Website Enquiry';
  return [base, category, company].filter(Boolean).join(' - ');
};

export function formatMessage(payload: EnquiryPayload): string {
  const lines = payload.fields.filter((f) => f.value.trim() !== '').map((f) => `${f.label}: ${f.value.trim()}`);
  return [`${subjectFor(payload)}`, '', ...lines, '', `Sent from: ${payload.page}`].join('\n');
}

export function mailtoLink(payload: EnquiryPayload): string {
  const subject = encodeURIComponent(subjectFor(payload));
  const body = encodeURIComponent(formatMessage(payload));
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

export function whatsappLink(payload: EnquiryPayload): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(formatMessage(payload))}`;
}
