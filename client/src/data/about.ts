import type { AboutSection } from '@/types/content';

/**
 * The About Us section, carried over from the legacy site at mannarubber.com.
 *
 * The eight pages below are the eight entries of the legacy About Us menu, in
 * the order the old site listed them. Copy is edited for tone and repetition
 * but every claim traces back to `legacy-site-content.md` at the repo root.
 *
 * ⚠️ Two things still need the business to confirm them before this goes live:
 *
 * 1. The founding date. Body copy across the legacy site says "three decades
 *    ago" while the export profile declares "Established in: 2020". The reading
 *    taken here is that the group dates back ~30 years and the Pvt. Ltd. entity
 *    was incorporated in 2020, so the fact table below is labelled accordingly
 *    rather than repeating a figure that contradicts the paragraph beside it.
 * 2. The milestone years. The legacy timeline is baked into an image and could
 *    not be scraped, so the entries here are pegged to eras that are documented
 *    ("three decades ago", "2020", "today") rather than to invented years.
 *    Swap in the real dates once the works supplies the original graphic.
 */

export const aboutSections: AboutSection[] = [
  {
    slug: 'about-our-export',
    navLabel: 'About our export',
    eyebrow: 'Export',
    title: 'About our export',
    lede: 'A registered MSME manufacturer shipping tread rubber, compounds and moulded goods to four countries, with ten more in view.',
    blocks: [
      {
        kind: 'lead',
        text: 'Established three decades ago, Manna Group stands as a leading manufacturer of customised moulded rubber products, rubber compound mixing, and the production of tread rubber and reclaimed rubber. With a commitment to excellence ingrained in our ethos, we have earned a reputation for delivering exceptional quality at competitive prices across Africa, the Middle East and India.',
      },
      {
        kind: 'facts',
        rows: [
          { label: 'Business type', value: 'Private Limited' },
          { label: 'Business activity', value: 'Manufacturer' },
          { label: 'Pvt. Ltd. incorporated', value: '2020' },
          { label: 'MSME registered', value: 'Yes' },
          { label: 'Employees', value: '51–100' },
          {
            label: 'Export turnover, last three years',
            value: 'US$500,000 – US$1,000,000',
          },
          {
            label: 'Currently exporting to',
            value: 'United Arab Emirates, Saudi Arabia, Ireland, Mozambique',
          },
        ],
      },
      { kind: 'heading', text: 'What sets us apart' },
      {
        kind: 'para',
        text: 'Competitive prices, exceptional customer service, reliable delivery and innovative solutions distinguish us as a valuable partner for our customers — whether you are a single works ordering one compound grade or a distributor placing a container.',
      },
      { kind: 'heading', text: 'Markets we want to reach next' },
      {
        kind: 'list',
        items: [
          'Kenya',
          'Qatar',
          'South Africa',
          'Tanzania',
          'United Kingdom',
          'United States',
          'Turkey',
          'Switzerland',
          'Rwanda',
          'Ethiopia',
        ],
      },
      { kind: 'heading', text: 'Proposals we are open to' },
      {
        kind: 'list',
        items: [
          'Agency requests',
          'Distributorship requests',
          'Contract manufacturing',
          'Joint ventures',
          'Buying agents',
          'Importers',
        ],
      },
    ],
  },
  {
    slug: 'what-we-are',
    navLabel: 'What we are',
    eyebrow: 'Who we are',
    title: 'What we are',
    lede: 'Your trusted partner for premium rubber solutions — thirty years of manufacturing from Rubber Park, Kerala.',
    blocks: [
      {
        kind: 'lead',
        text: 'Welcome to Manna Group. Established three decades ago, we are a manufacturer specialising in customised moulded rubber products, rubber compound mixing, tread rubber and reclaimed rubber production. Our commitment to excellence has cemented our reputation for delivering superior quality at competitive prices across Africa, the Middle East and India.',
      },
      {
        kind: 'para',
        text: 'With a legacy of thirty years, Manna Group has led the rubber industry with innovative solutions and exceptional service. Starting from modest beginnings, we have grown into a manufacturer serving diverse industries with precision and expertise.',
      },
      { kind: 'heading', text: 'What we make' },
      {
        kind: 'para',
        text: 'Our expertise lies in crafting bespoke moulded rubber solutions tailored to specific client needs. Equipped with modern facilities and a skilled workforce, we consistently meet the standards our customers set for us.',
      },
      {
        kind: 'para',
        text: 'Our service offering runs from rubber compound mixing through to the production of tread and reclaimed rubber. With an emphasis on innovation and continuous improvement, we hold to rigorous quality standards to ensure reliability and performance.',
      },
      { kind: 'heading', text: 'How we work' },
      {
        kind: 'para',
        text: 'Quality assurance is paramount at Manna Group. We apply stringent quality control measures throughout our manufacturing processes, which is what has earned the trust and loyalty of our customers.',
      },
      {
        kind: 'para',
        text: 'A commitment to sustainability underpins our operations. We prioritise eco-friendly practice, from responsible sourcing of raw materials to efficient energy use and waste reduction, so our products meet high standards and promote environmental stewardship at the same time.',
      },
      {
        kind: 'para',
        text: 'Customer satisfaction drives our business philosophy. We build enduring relationships on trust and transparency, anticipating and meeting client needs with tailored solutions.',
      },
      {
        kind: 'para',
        text: 'Operating across Africa, the Middle East and India, Manna Group is a name recognised by industry leaders. Looking forward, we remain dedicated to innovation, sustainability and setting industry benchmarks.',
      },
    ],
  },
  {
    slug: 'why-we-do-this',
    navLabel: 'Why we do this',
    eyebrow: 'Purpose',
    title: 'Why we do this',
    lede: 'We are not just in the business of manufacturing rubber products — we are in the business of delivering solutions.',
    blocks: [
      {
        kind: 'lead',
        text: 'At Manna Group we are not just in the business of manufacturing rubber products — we are in the business of delivering solutions. Our purpose is to be the premier provider of high-quality rubber solutions that enhance performance, promote sustainability and exceed the expectations of our customers.',
      },
      {
        kind: 'para',
        text: 'For thirty years, Manna Group has been a trusted name in the industry, known for a commitment to excellence and innovation. Our journey began with a vision to create products that not only meet the needs of our customers but also contribute positively to the environment and the communities we serve.',
      },
      { kind: 'heading', text: 'Quality first' },
      {
        kind: 'para',
        text: 'Quality sits at the heart of everything we do. From the selection of raw materials to the manufacturing process and beyond, we hold to the highest standards so that every product leaving our facility is of superior quality and reliability.',
      },
      {
        kind: 'para',
        text: 'But our purpose goes beyond quality — it is about providing solutions that address the challenges our customers face. Whether that is developing custom rubber components for a specific application or finding a way to improve efficiency and performance, we are dedicated to finding the right answer to the problem in front of us.',
      },
      { kind: 'heading', text: 'A lighter footprint' },
      {
        kind: 'para',
        text: 'Sustainability is a core value. We believe in responsible manufacturing practices that minimise our environmental impact and contribute to a greener future. From using recycled materials to running energy-efficient processes, we are committed to doing our part to protect the planet for future generations.',
      },
      { kind: 'heading', text: 'Relationships that last' },
      {
        kind: 'para',
        text: 'We understand that our success is tied to the success of our customers. That is why we build lasting relationships based on trust, reliability and mutual respect, working closely with customers to understand their requirements and deliver solutions that help them reach their goals.',
      },
      {
        kind: 'para',
        text: 'As we look to the future, our purpose remains clear: to be the leading provider of high-quality rubber solutions that drive innovation, promote sustainability and exceed customer expectations.',
      },
    ],
  },
  {
    slug: 'timeline',
    navLabel: 'How we reached here: timeline',
    eyebrow: 'Business milestones',
    title: 'How we reached here',
    lede: 'From a modest works in Perumbavoor to a registered exporter shipping across Africa, the Middle East and Europe.',
    blocks: [
      {
        kind: 'lead',
        text: 'Thirty years separate our first mixing mill from the plant that stands at Rubber Park today. These are the turns that mattered.',
      },
      {
        kind: 'timeline',
        items: [
          {
            period: 'Three decades ago',
            title: 'Manna Group is founded',
            body: 'The works starts out mixing rubber compounds and producing tread rubber for the retreading trade in Kerala.',
          },
          {
            period: 'The growth years',
            title: 'From modest beginnings to a full works',
            body: 'Moulded goods and reclaimed rubber join the line, and the plant moves onto Plot 67–68 at Rubber Park, Valayanchirangara — purpose-built ground for rubber manufacture.',
          },
          {
            period: '2020',
            title: 'Incorporated as Manna Rubber Products Pvt. Ltd.',
            body: 'The business is registered as a private limited company and an MSME manufacturer, with 51 to 100 people on the floor.',
          },
          {
            period: 'Today',
            title: 'Exporting to four countries',
            body: 'Tread rubber, compounds, reclaimed rubber and moulded goods ship to the United Arab Emirates, Saudi Arabia, Ireland and Mozambique, on an export turnover of US$500,000 to US$1,000,000 over the last three years.',
          },
          {
            period: 'Next',
            title: 'Ten more markets in view',
            body: 'We are actively seeking agents, distributors and contract manufacturing partners in Kenya, Qatar, South Africa, Tanzania, the United Kingdom, the United States, Turkey, Switzerland, Rwanda and Ethiopia.',
          },
        ],
      },
    ],
  },
  {
    slug: 'vision',
    navLabel: 'Vision',
    eyebrow: 'Vision',
    title: 'Our vision',
    lede: 'To be the global leader in high-quality rubber products, driving innovation, sustainability and customer satisfaction.',
    blocks: [
      {
        kind: 'quote',
        text: 'To be the global leader in high-quality rubber products, driving innovation, sustainability and customer satisfaction.',
      },
      {
        kind: 'para',
        text: 'That is a long sentence for a simple idea: whatever a customer asks us to make, it should come back better than the part it replaced, cost less to run, and leave less behind it.',
      },
      {
        kind: 'para',
        text: 'Thirty years of manufacturing across Africa, the Middle East and India is what gives the ambition its footing. Every grade we mix, every pattern we press and every tyre we retread is judged against it.',
      },
    ],
  },
  {
    slug: 'mission',
    navLabel: 'Mission',
    eyebrow: 'Mission',
    title: 'Our mission',
    lede: 'To provide superior rubber products through innovation, sustainable practices and exceptional customer service.',
    blocks: [
      {
        kind: 'quote',
        text: 'Our mission is to provide superior rubber products through innovation, sustainable practices and exceptional customer service.',
      },
      {
        kind: 'para',
        text: 'We aim for global leadership by delivering high-quality solutions that answer a customer’s need while reducing the environmental footprint of making them.',
      },
      {
        kind: 'para',
        text: 'In practice that means three things: compounds and mouldings built to the standard the drawing calls for, a retreading and reclaim programme that keeps rubber in service instead of in landfill, and a team that answers the phone when a job goes sideways.',
      },
    ],
  },
  {
    slug: 'goals',
    navLabel: 'Goals',
    eyebrow: 'Goals',
    title: 'Our goals',
    lede: 'Five commitments that decide what we invest in, what we make and how we measure a good year.',
    blocks: [
      {
        kind: 'points',
        items: [
          {
            title: 'Innovation',
            body: 'Innovation is in our DNA. We are dedicated to pushing boundaries in the rubber industry through continuous research and development, pioneering methods that improve product performance, efficiency and sustainability so we stay ahead in a competitive global market.',
          },
          {
            title: 'Growth',
            body: 'We are committed to sustainable growth worldwide — expanding our product range, entering new markets and strengthening our presence through strategic partnerships and investment in technology.',
          },
          {
            title: 'Sustainability',
            body: 'Sustainability is integral to how we operate. We are dedicated to minimising our environmental impact across operations: reducing waste, conserving resources and promoting eco-friendly alternatives throughout the product lifecycle.',
          },
          {
            title: 'Quality',
            body: 'Quality is non-negotiable. We hold the highest standards across product design, manufacturing and distribution to deliver reliable, durable solutions that exceed customer expectations.',
          },
          {
            title: 'Customer satisfaction',
            body: 'We prioritise building lasting relationships based on trust, integrity and respect. By understanding what our customers need and delivering solutions that go beyond it, we aim to become their preferred partner in the rubber industry.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ceo-message',
    navLabel: 'CEO message',
    eyebrow: 'From the Managing Director',
    title: 'A message from our Managing Director',
    lede: 'Alias Mathew on what Manna Group sets out to be for the industries it serves.',
    blocks: [
      {
        kind: 'quote',
        text: 'Welcome to Manna Group. We are proud to be a leading provider of rubber solutions for a wide range of industries. Our team of experts is dedicated to providing exceptional customer service and delivering top-quality products. Thank you for choosing Manna Group as your trusted partner for all your rubber needs.',
        source: 'Alias Mathew — Managing Director',
      },
      {
        kind: 'para',
        text: 'If there is a part you cannot source, a compound that keeps failing in service, or a fleet running through tyres faster than it should, the door is open. Send the drawing, the sample or the worn part and our engineers will tell you plainly whether it is work we can do well.',
      },
    ],
  },
];

/** The About index copy, shared by the hub page and the mega menu. */
export const aboutIntro = {
  eyebrow: 'About us',
  title: 'Three decades of rubber, made in Kerala.',
  lede: 'Manna Group manufactures customised moulded rubber products, mixes rubber compounds, and produces tread rubber and reclaimed rubber — delivering quality at competitive prices across Africa, the Middle East and India.',
} as const;

export function findAboutSection(slug: string): AboutSection | undefined {
  return aboutSections.find((section) => section.slug === slug);
}

/** Previous and next entries, for the pager at the foot of a page. */
export function aboutNeighbours(slug: string): {
  previous?: AboutSection;
  next?: AboutSection;
} {
  const index = aboutSections.findIndex((section) => section.slug === slug);
  if (index < 0) return {};
  return {
    previous: aboutSections[index - 1],
    next: aboutSections[index + 1],
  };
}
