import type { NavGroup, NavItem, NavLink } from '@/types/content';

/**
 * Company identity and contact details.
 *
 * Everything here is taken from the legacy site at mannarubber.com — see
 * `legacy-site-content.md` at the repo root for the full extraction and the
 * open questions still to settle with the business.
 */
export const site = {
  name: 'Manna',
  suffix: 'Rubber',
  legalName: 'Manna Rubber Products Pvt. Ltd.',
  groupName: 'Manna Group',
  tagline: 'Custom rubber products, built on quality and excellence.',
  /**
   * The one address the site publishes. Everything that offers to email —
   * the footer, the contact block, quote requests from a product page and
   * from the wishlist — goes here, so there is a single place to change it.
   */
  email: 'mail@hi-techtreads.com',
  phone: '+91 90370 25722',
  /** `tel:` needs the number without spaces. */
  phoneHref: '+919037025722',
  gst: '32AAMCM6265E1ZG',
  address: {
    line1: 'Plot No. 67, 68, Site A, Rubber Park',
    line2: 'Valayanchirangara, Perumbavoor',
    city: 'Ernakulam',
    state: 'Kerala',
    postcode: '683556',
    country: 'India',
  },
  mapsQuery: 'Manna Rubber Products, Rubber Park, Valayanchirangara, Kerala',
  blurb:
    'Customised moulded rubber products, rubber compound mixing, tread rubber and reclaimed rubber. Three decades of manufacturing from Rubber Park, Kerala.',
} as const;

/** Single-line address for footers and schema markup. */
export const addressLine = [
  site.address.line1,
  site.address.line2,
  site.address.city,
  `${site.address.state} ${site.address.postcode}`,
  site.address.country,
].join(', ');

export const announcement = {
  tag: 'Export',
  text: 'Now shipping to the UAE, Saudi Arabia, Ireland and Mozambique',
  link: { label: 'Talk to our export desk', href: '#contact' } satisfies NavLink,
} as const;

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/products',
    menu: {
      columns: [
        [
          {
            title: 'Tyre',
            links: [
              { label: 'Tread rubber', href: '/products?category=tread-rubber' },
              { label: 'Tyre retreading', href: '/products?category=retreading' },
              { label: 'VIKING pattern', href: '/products/tread-viking' },
              { label: 'Mine Special ML', href: '/products/tread-mine-special-ml' },
            ],
          },
        ],
        [
          {
            title: 'Materials',
            links: [
              {
                label: 'Rubber compounds & mixing',
                href: '/products?category=compounds',
              },
              { label: 'Reclaimed rubber', href: '/products?category=reclaimed' },
              {
                label: 'Devulcanized rubber crumb',
                href: '/products/reclaim-devulcanized-rubber-crumb',
              },
              { label: 'EPDM compound', href: '/products/compound-epdm-h-70-high' },
            ],
          },
        ],
        [
          {
            title: 'Moulded goods',
            links: [
              { label: 'O-rings & quad rings', href: '/products/moulded-o-rings' },
              { label: 'Oil seals & wire seals', href: '/products/moulded-oil-seals' },
              { label: 'Dampers & buffers', href: '/products/moulded-dampers' },
              { label: 'All moulded goods', href: '/products?category=moulded' },
            ],
          },
          {
            title: 'Infrastructure',
            links: [
              { label: 'Pulley rubber lagging', href: '/products/moulded-pulley-lagging' },
              { label: 'Rubber roofing', href: '/products/moulded-roofing' },
            ],
          },
        ],
      ],
      featured: [
        {
          title: 'For fleets',
          items: [
            {
              label: 'Retreading programme',
              description:
                'Hot and PCTR retreading in nylon, radial and off-road sizes',
              href: '/products?category=retreading',
            },
          ],
        },
        {
          title: 'For manufacturers',
          items: [
            {
              label: 'Compound grades',
              description: 'Sixteen NR, SBR, ISNR and EPDM grades mixed to order',
              href: '/products?category=compounds',
            },
            {
              label: 'Custom moulding',
              description: 'Bespoke moulded parts made to your drawing or sample',
              href: '/products?category=moulded',
            },
          ],
        },
      ],
      cta: { label: 'View all products', href: '/products' },
    },
  },
  {
    label: 'About',
    href: '/about',
    menu: {
      columns: [
        [
          {
            title: 'The company',
            links: [
              { label: 'What we are', href: '/about/what-we-are' },
              { label: 'Why we do this', href: '/about/why-we-do-this' },
              {
                label: 'How we reached here: timeline',
                href: '/about/timeline',
              },
            ],
          },
        ],
        [
          {
            title: 'What we stand for',
            links: [
              { label: 'Vision', href: '/about/vision' },
              { label: 'Mission', href: '/about/mission' },
              { label: 'Goals', href: '/about/goals' },
            ],
          },
        ],
        [
          {
            title: 'Leadership & export',
            links: [
              { label: 'CEO message', href: '/about/ceo-message' },
              { label: 'About our export', href: '/about/about-our-export' },
              { label: 'Contact us', href: '#contact' },
            ],
          },
        ],
      ],
      featured: [
        {
          title: 'In brief',
          items: [
            {
              label: 'Three decades in rubber',
              description:
                'Moulded goods, compounds, tread rubber and reclaim from Rubber Park, Kerala',
              href: '/about/what-we-are',
            },
            {
              label: 'A registered exporter',
              description:
                'MSME manufacturer shipping to the UAE, Saudi Arabia, Ireland and Mozambique',
              href: '/about/about-our-export',
            },
          ],
        },
      ],
      cta: { label: 'All about Manna Group', href: '/about' },
    },
  },
];

export const footerNav: NavGroup[] = [
  {
    title: 'Products',
    links: [
      { label: 'Tread rubber', href: '/products?category=tread-rubber' },
      { label: 'Tyre retreading', href: '/products?category=retreading' },
      { label: 'Rubber compounds & mixing', href: '/products?category=compounds' },
      { label: 'Reclaimed rubber', href: '/products?category=reclaimed' },
      { label: 'Rubber moulded goods', href: '/products?category=moulded' },
      { label: 'Full catalogue', href: '/products' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Commercial fleets', href: '#industries' },
      { label: 'Mining & quarrying', href: '#industries' },
      { label: 'Agriculture', href: '#industries' },
      { label: 'Construction', href: '#industries' },
      { label: 'Material handling', href: '#industries' },
      { label: 'Building & roofing', href: '#industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Manna Group', href: '/about' },
      { label: 'What we are', href: '/about/what-we-are' },
      { label: 'Vision, mission & goals', href: '/about/vision' },
      { label: 'CEO message', href: '/about/ceo-message' },
      { label: 'About our export', href: '/about/about-our-export' },
      { label: 'Contact us', href: '#contact' },
    ],
  },
  {
    title: 'Get in touch',
    links: [
      { label: 'Request a quote', href: '#contact' },
      { label: 'Your wishlist', href: '/wishlist' },
      { label: site.phone, href: `tel:${site.phoneHref}` },
      { label: site.email, href: `mailto:${site.email}` },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Accessibility', href: '#' },
  { label: 'Cookies', href: '#' },
];
