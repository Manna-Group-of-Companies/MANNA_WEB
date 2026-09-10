import type { Product, ProductTile } from '@/types/content';

/**
 * Hero carousel rows. Two rows drift in opposite directions; each row's
 * list is duplicated at render time so the loop is seamless, so keep the
 * rows a similar length or one will visibly cycle faster than the other.
 *
 * Add an `image` to any tile to swap the CSS-drawn pattern for photography.
 */
/**
 * Photography lives in `client/public/products`, resized to 800w and 1200w —
 * the tile caps at 369 CSS px, so 1200w covers a 3× display and nothing more
 * is worth the bytes. Full-resolution originals are kept in `design-source/`
 * at the repo root, outside `public/`, so they are not shipped.
 *
 * `label` is the image's alt text, so it has to describe what is actually in
 * the photograph rather than the tile's place in the row.
 */
const grommets: ProductTile = {
  id: 'grommets',
  label: 'Grommets and bushes',
  pattern: 'weave',
  image: {
    src: '/products/grommets-and-bushes.jpg',
    srcSet:
      '/products/grommets-and-bushes-800.jpg 800w, /products/grommets-and-bushes-1200.jpg 1200w',
  },
};

const antiVibrationMounts: ProductTile = {
  id: 'avm',
  label: 'Anti-vibration mounts',
  pattern: 'rings',
  image: {
    src: '/products/anti-vibration-mounts.jpg',
    srcSet:
      '/products/anti-vibration-mounts-800.jpg 800w, /products/anti-vibration-mounts-1200.jpg 1200w',
  },
};

const gaskets: ProductTile = {
  id: 'gaskets',
  label: 'Rubber gaskets',
  pattern: 'rings',
  image: {
    src: '/products/gaskets.jpg',
    srcSet: '/products/gaskets-800.jpg 800w, /products/gaskets-1200.jpg 1200w',
  },
};

const diaphragms: ProductTile = {
  id: 'diaphragms',
  label: 'Rubber diaphragms',
  pattern: 'rings',
  image: {
    src: '/products/diaphragms.jpg',
    srcSet: '/products/diaphragms-800.jpg 800w, /products/diaphragms-1200.jpg 1200w',
  },
};

const bellows: ProductTile = {
  id: 'bellows',
  label: 'Rubber bellows',
  pattern: 'stripe',
  image: {
    src: '/products/bellows.jpg',
    srcSet: '/products/bellows-800.jpg 800w, /products/bellows-1200.jpg 1200w',
  },
};

const mounts: ProductTile = {
  id: 'mounts',
  label: 'Rubber mounts',
  pattern: 'tread',
  image: {
    src: '/products/mounts.jpg',
    srcSet: '/products/mounts-800.jpg 800w, /products/mounts-1200.jpg 1200w',
  },
};

/**
 * Both rows carry all six photographs, in different orders.
 *
 * Splitting them three and three looked tidier in the source but put the same
 * picture on screen twice at once: a row of three is about 1230px, so a laptop
 * showed three tiles and then the first one again. Six per row is ~2450px, so
 * the repeat is off-screen at any width the row is actually read at. The rows
 * drift in opposite directions and start at different offsets, which keeps
 * them from reading as two copies of the same strip.
 */
export const heroCarouselRows: ProductTile[][] = [
  [grommets, antiVibrationMounts, gaskets, diaphragms, bellows, mounts],
  [diaphragms, mounts, bellows, gaskets, grommets, antiVibrationMounts],
];

/** Panels for the tabbed product showcase — one per production line. */
export const products: Product[] = [
  {
    id: 'tread-rubber',
    tab: 'Tread rubber',
    title: 'Tread rubber',
    body: 'Fifty patterns covering highway, hill, mine and agricultural duty. The range is built around greater mileage, decreased abrasion and improved load distribution, with traction that holds on both wet and dry surfaces.',
    points: [
      'Short, long and hill application patterns',
      'Mine and tractor-specific designs in the range',
      'Elevated land–sea ratio for driving stability',
    ],
    pattern: 'tread',
  },
  {
    id: 'retreading',
    tab: 'Retreading',
    title: 'Tyre retreading',
    body: 'Hot and PCTR retreading across nylon, radial and off-road configurations. A retread renews a worn casing for a fraction of the oil a new tyre needs, which is why fleets keep coming back to it.',
    points: [
      'PCTR nylon, radial and off-road processes',
      'Sizes from 1000×20 through to 17.5×25',
      'Checked against industry safety standards',
    ],
    pattern: 'rings',
  },
  {
    id: 'compounds',
    tab: 'Compounds',
    title: 'Rubber compounds & mixing',
    body: 'Sixteen grades on the book across natural rubber, SBR, ISNR and EPDM, mixed to hardness in our own works. EPDM is the one to specify where UV, ozone and weathering are the problem.',
    points: [
      'NR, SBR, ISNR and EPDM grades from 40 to 85 hardness',
      'EPDM for UV, ozone and temperature extremes',
      'Minimum enquiry quantity of one',
    ],
    pattern: 'dots',
  },
  {
    id: 'reclaimed',
    tab: 'Reclaimed',
    title: 'Reclaimed rubber',
    body: 'Special, Superfine, Matt Superfine and Course grades, plus devulcanized rubber crumb. Recycled feedstock that brings material cost down without giving up durability or flexibility.',
    points: [
      'Four reclaim grades plus devulcanized crumb',
      'Sustainable composition, cost-effective performance',
      'Blends into existing compounds to cut virgin content',
    ],
    pattern: 'weave',
  },
  {
    id: 'moulded',
    tab: 'Moulded goods',
    title: 'Rubber moulded goods',
    body: 'Twenty-one product types made to your drawing, your sample, or the worn part itself — O-rings, grommets, diaphragms, oil seals, dampers, lagging and building protection systems.',
    points: [
      'Sealing: O-rings, quad rings, wire seals, oil seals',
      'Vibration: dampers, buffers, pads and mounts',
      'Infrastructure: pulley lagging, roofing, pipe supports',
    ],
    pattern: 'grid',
  },
];
