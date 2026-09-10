import type { Capability, Stat, Testimonial } from '@/types/content';

/**
 * Figures taken from the legacy site's export profile and product listings.
 *
 * `years` is the "three decades" the company claims in its own copy; `patterns`
 * and `people` are countable facts (50 tread patterns catalogued, 51–100
 * employees declared). Confirm all three before print.
 */
export const stats: Stat[] = [
  { id: 'years', value: 30, suffix: '+', label: 'Years manufacturing rubber' },
  { id: 'patterns', value: 50, suffix: '', label: 'Tread rubber patterns' },
  { id: 'people', value: 50, suffix: '+', label: 'People on the floor' },
];

/**
 * The capability rail — one card per production line, read in the order the
 * business itself lists them. Chips carry only figures we can stand behind:
 * catalogue counts, declared grades and the terms published on the old site.
 */
export const capabilities: Capability[] = [
  {
    id: 'tread-rubber',
    title: 'Tread rubber',
    body: 'Fifty tread patterns for highway, hill, mine and agricultural duty — built for greater mileage, decreased abrasion and improved load distribution across wet and dry surfaces.',
    pattern: 'tread',
    image: {
      src: '/capabilities/tread-rubber.jpg',
      srcSet:
        '/capabilities/tread-rubber-400.jpg 400w, /capabilities/tread-rubber-600.jpg 600w',
    },
    tone: 'ink',
    chips: [
      { label: 'Patterns', value: '50', at: 'top-right' },
      { label: 'Duty', value: 'Short, long, hill', at: 'bottom-left' },
    ],
    link: { label: 'Browse the patterns', href: '/products?category=tread-rubber' },
  },
  {
    id: 'retreading',
    title: 'Tyre retreading',
    body: 'Hot and PCTR retreading in nylon, radial and off-road configurations. A retread takes a fraction of the oil a new tyre needs, so the fleet cost and the carbon both come down.',
    pattern: 'rings',
    image: {
      src: '/capabilities/retreading.jpg',
      srcSet:
        '/capabilities/retreading-400.jpg 400w, /capabilities/retreading-600.jpg 600w',
    },
    tone: 'teal',
    chips: [
      { label: 'Processes', value: 'Hot & PCTR', at: 'top-left' },
      { label: 'Sizes', value: '1000×20 – 17.5×25', at: 'mid-right' },
    ],
    link: { label: 'See the range', href: '/products?category=retreading' },
  },
  {
    id: 'compounds',
    title: 'Rubber compounds & mixing',
    body: 'Sixteen grades on the book across NR, SBR, ISNR and EPDM, mixed to hardness. EPDM for UV, ozone and weathering duty; natural rubber grades from 40 to 85 hardness.',
    pattern: 'dots',
    image: {
      src: '/capabilities/compounds.jpg',
      srcSet:
        '/capabilities/compounds-400.jpg 400w, /capabilities/compounds-600.jpg 600w',
    },
    tone: 'slate',
    chips: [
      { label: 'Grades', value: '16', at: 'top-right' },
      { label: 'HSN', value: '4002', at: 'bottom-left' },
    ],
    link: { label: 'Compound grades', href: '/products?category=compounds' },
  },
  {
    id: 'reclaimed',
    title: 'Reclaimed rubber',
    body: 'Special, Superfine, Matt Superfine and Course grades, plus devulcanized rubber crumb. Recycled feedstock that cuts material cost without giving up performance.',
    pattern: 'weave',
    image: {
      src: '/capabilities/reclaimed.jpg',
      srcSet:
        '/capabilities/reclaimed-400.jpg 400w, /capabilities/reclaimed-600.jpg 600w',
    },
    tone: 'clay',
    chips: [
      { label: 'Grades', value: '5', at: 'top-left' },
      { label: 'Feedstock', value: 'Recycled', at: 'bottom-right' },
    ],
    link: { label: 'Reclaim grades', href: '/products?category=reclaimed' },
  },
  {
    id: 'moulded',
    title: 'Rubber moulded goods',
    body: 'Customised moulded components — O-rings, grommets, diaphragms, oil seals, dampers and bonded assemblies — made to your drawing, your sample, or the worn part itself.',
    pattern: 'grid',
    image: {
      src: '/capabilities/moulded.jpg',
      srcSet:
        '/capabilities/moulded-400.jpg 400w, /capabilities/moulded-600.jpg 600w',
    },
    tone: 'ink',
    chips: [
      { label: 'Product types', value: '21', at: 'top-right' },
      { label: 'Enquiry qty', value: 'From 1', at: 'mid-left' },
    ],
    link: { label: 'Moulded catalogue', href: '/products?category=moulded' },
  },
  {
    id: 'quality',
    title: 'Quality & traceability',
    body: 'Finest raw materials in, stringent quality control throughout. Retreaded tyres are checked against industry safety standards before they leave the works.',
    pattern: 'stripe',
    image: {
      src: '/capabilities/quality.jpg',
      srcSet:
        '/capabilities/quality-400.jpg 400w, /capabilities/quality-600.jpg 600w',
    },
    tone: 'slate',
    chips: [
      { label: 'Origin', value: 'India', at: 'top-left' },
      { label: 'GST', value: '32AAMCM6265E1ZG', at: 'bottom-right' },
    ],
    link: { label: 'Ask about our process', href: '#contact' },
  },
];

export const industries: string[] = [
  'Commercial fleets',
  'Mining & quarrying',
  'Agriculture',
  'Construction',
  'Material handling',
  'Building & roofing',
  'General engineering',
];

export const qualityPoints: string[] = [
  'Only the finest raw materials, with stringent quality control at every stage',
  'Retreads verified against industry safety standards before despatch',
  'Recycling and retreading that cut waste and conserve natural resources',
];

/**
 * The Managing Director's message from the legacy site. It is the one quote on
 * record — swap it for a customer testimonial once there is a real one to use.
 */
export const testimonial: Testimonial = {
  quote:
    'We are proud to be a leading provider of rubber solutions for a wide range of industries. Our team of experts is dedicated to providing exceptional customer service and delivering top-quality products. Thank you for choosing Manna Group as your trusted partner for all your rubber needs.',
  name: 'Alias Mathew',
  org: 'Managing Director, Manna Group',
};
