import { Hero } from '@/components/sections/Hero/Hero';
import { StatsBand } from '@/components/sections/StatsBand/StatsBand';
import { Capabilities } from '@/components/sections/Capabilities/Capabilities';
import { IndustriesStrip } from '@/components/sections/IndustriesStrip/IndustriesStrip';
import { Testimonial } from '@/components/sections/Testimonial/Testimonial';
import { Reviews } from '@/components/sections/Reviews/Reviews';
import { LeadCta } from '@/components/sections/LeadCta/LeadCta';

/**
 * Section order for the marketing homepage.
 *
 * The order also fixes the nav's anchor targets: `#capabilities`, `#industries`,
 * `#about` and `#contact` all resolve to a section rendered here, so nothing in
 * the header or footer points at nothing.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <Capabilities />
      <IndustriesStrip />
      <Testimonial />
      <Reviews />
      <LeadCta />
    </>
  );
}
