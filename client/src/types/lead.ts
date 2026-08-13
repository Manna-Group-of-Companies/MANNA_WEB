export interface LeadPayload {
  email: string;
  /** Where on the site the lead was captured. */
  source?: string;
}

export interface LeadResponse {
  ok: boolean;
  message: string;
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
