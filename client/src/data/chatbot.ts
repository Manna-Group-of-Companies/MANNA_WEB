import { site } from '@/data/site';

export interface ChatIntent {
  id: string;
  /** Keywords matched against the visitor's message (lowercased, no punctuation). */
  keywords: string[];
  reply: string;
  /** Quick-reply chips shown under this answer. */
  followUps?: string[];
}

export const greeting =
  `Hi, I'm the ${site.name} ${site.suffix} assistant. Ask me about our products, ` +
  'quotes, export shipping or how to reach us — or tap a question below.';

export const fallback =
  "I don't have an answer for that yet. Try asking about our products, getting a " +
  `quote, export shipping, or contact details — or email us directly at ${site.email}.`;

export const suggestedPrompts = [
  'What products do you make?',
  'How do I get a quote?',
  'Do you export?',
  'Where are you located?',
];

export const intents: ChatIntent[] = [
  {
    id: 'products',
    keywords: [
      'product',
      'products',
      'make',
      'manufacture',
      'tread',
      'tyre',
      'tire',
      'gasket',
      'grommet',
      'mount',
      'rubber',
      'compound',
      'reclaimed',
      'retread',
    ],
    reply:
      'We manufacture tread rubber, tyre retreading materials, rubber compounds and ' +
      'mixing, reclaimed rubber, and custom moulded rubber products such as ' +
      'grommets, bushes, anti-vibration mounts and gaskets. You can browse the full ' +
      'catalogue on the Products page.',
    followUps: ['How do I get a quote?', 'Do you export?'],
  },
  {
    id: 'quote',
    keywords: ['quote', 'price', 'pricing', 'cost', 'quotation', 'enquiry', 'inquiry', 'order'],
    reply:
      'Open any product page and use "Request a quote" — or email us directly at ' +
      `${site.email} / call ${site.phone} with your requirement and quantity, and ` +
      "we'll get back to you.",
    followUps: ['Where are you located?', 'Do you export?'],
  },
  {
    id: 'export',
    keywords: ['export', 'ship', 'shipping', 'international', 'overseas', 'uae', 'abroad', 'country'],
    reply:
      'Yes — we currently export to the UAE, Saudi Arabia, Ireland and Mozambique. ' +
      `Talk to our export desk via ${site.email} or ${site.phone} for shipping and lead times.`,
    followUps: ['How do I get a quote?'],
  },
  {
    id: 'location',
    keywords: ['located', 'location', 'address', 'where', 'factory', 'park', 'kerala', 'visit'],
    reply: `We're based at ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postcode}, ${site.address.country}.`,
    followUps: ['How do I contact you?'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'call', 'phone', 'email', 'reach', 'talk', 'support'],
    reply: `You can reach us on ${site.phone} or by email at ${site.email}.`,
    followUps: ['Where are you located?', 'What products do you make?'],
  },
  {
    id: 'about',
    keywords: ['about', 'company', 'history', 'experience', 'years', 'who'],
    reply: `${site.legalName} is part of ${site.groupName}. ${site.blurb}`,
    followUps: ['What products do you make?'],
  },
  {
    id: 'hours',
    keywords: ['hours', 'open', 'timing', 'time'],
    reply:
      'Our team responds to enquiries during regular business hours, India Standard ' +
      `Time. For anything urgent, call ${site.phone}.`,
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank', 'thankyou', 'great', 'ok', 'okay', 'cool'],
    reply: "You're welcome! Anything else I can help with?",
  },
  {
    id: 'hello',
    keywords: ['hi', 'hello', 'hey', 'hii', 'yo'],
    reply: greeting,
  },
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

export function matchIntent(message: string): ChatIntent | null {
  const words = new Set(normalize(message).split(/\s+/).filter(Boolean));
  let best: { intent: ChatIntent; score: number } | null = null;

  for (const intent of intents) {
    const score = intent.keywords.reduce(
      (count, keyword) => count + (words.has(keyword) ? 1 : 0),
      0,
    );
    if (score > 0 && (!best || score > best.score)) {
      best = { intent, score };
    }
  }

  return best?.intent ?? null;
}
