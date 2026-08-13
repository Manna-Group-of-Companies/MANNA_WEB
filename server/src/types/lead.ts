export interface LeadInput {
  email: string;
  source: string;
}

export interface LeadRecord extends LeadInput {
  id: string;
  createdAt: string;
  userAgent: string | null;
}
