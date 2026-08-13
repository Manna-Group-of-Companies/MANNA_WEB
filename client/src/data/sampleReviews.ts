import type { Review } from '@/types/review';

/* ------------------------------------------------------------------
   PLACEHOLDER REVIEWS — not real customers.

   The people, companies and comments below are invented, to give the
   reviews band something to show before real ones arrive.

   Two rules keep this honest, and both are enforced in `useReviews`:

   1. They appear ONLY when there are no real reviews at all. The first
      genuine review replaces the whole set, so an invented card is never
      shown next to a real one.
   2. While they are showing, the section says so under the row.

   They also only mention work Manna actually does — tread rubber,
   retreading, compounds, reclaim and moulded goods. An invented review
   for a service the company cannot supply generates enquiries nobody can
   answer, which is a worse problem than an empty rail.

   Turn them off with the flag below — or delete this file and the two
   imports of it. Do that before the site goes in front of customers:
   invented testimonials on a commercial page count as misleading
   advertising under the UK DMCC Act, the EU Omnibus Directive and the
   FTC's rule on fake reviews.
------------------------------------------------------------------- */

export const SHOW_SAMPLE_REVIEWS = true;

export const sampleReviews: Review[] = [
  {
    id: 'sample-1',
    name: 'Priya Raman',
    picture: null,
    rating: 5,
    comment:
      'We run sixty trucks on the Kochi–Coimbatore route and moved the whole fleet onto VIKING tread. Mileage is up and the wear is even right across the shoulder.',
    createdAt: '2026-03-11T09:12:00.000Z',
    updatedAt: '2026-03-11T09:12:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-2',
    name: 'Tom Whitfield',
    picture: null,
    rating: 4,
    comment:
      'PCTR retreads came back with the casings properly inspected and the paperwork already attached. Turnaround could be a day quicker in the monsoon.',
    createdAt: '2026-04-02T14:40:00.000Z',
    updatedAt: '2026-04-02T14:40:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-3',
    name: 'Aisha Bello',
    picture: null,
    rating: 5,
    comment:
      'Their EPDM compound has been out in the sun on our roof seals for two summers with no cracking at all. We have stopped specifying anything else.',
    createdAt: '2026-04-21T11:05:00.000Z',
    updatedAt: '2026-04-21T11:05:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-4',
    name: 'Marcus Lindqvist',
    picture: null,
    rating: 5,
    comment:
      'Sent a worn oil seal and a rough sketch. What came back fitted first time, and the second batch was identical to the first.',
    createdAt: '2026-05-01T16:22:00.000Z',
    updatedAt: '2026-05-01T16:22:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-5',
    name: 'Daniel Okoro',
    picture: null,
    rating: 5,
    comment:
      'Mine Special ML on the quarry loaders has taken a full season of sharp rock. We have put the repeat order on a standing call-off.',
    createdAt: '2026-05-19T10:00:00.000Z',
    updatedAt: '2026-05-19T10:00:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-6',
    name: 'Helen Voss',
    picture: null,
    rating: 4,
    comment:
      'Reclaim Superfine took a useful slice off our compound cost without changing how the batch behaves on the mill.',
    createdAt: '2026-06-05T12:00:00.000Z',
    updatedAt: '2026-06-05T12:00:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-7',
    name: 'Rajesh Nair',
    picture: null,
    rating: 5,
    comment:
      'Thirty years buying rubber in Kerala and this is the first supplier who answers the phone when there is a problem rather than after it.',
    createdAt: '2026-06-18T08:30:00.000Z',
    updatedAt: '2026-06-18T08:30:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-8',
    name: 'Fatima Al-Mansouri',
    picture: null,
    rating: 5,
    comment:
      'Shipping to Sharjah has been on time every quarter. Documentation is right first time, which matters more than people think at this end.',
    createdAt: '2026-06-29T13:15:00.000Z',
    updatedAt: '2026-06-29T13:15:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-9',
    name: 'Joseph Mwangi',
    picture: null,
    rating: 4,
    comment:
      'Ordered grommets and bushes in four sizes off our drawing. All four to tolerance. Minimum order of one made the trial easy to justify.',
    createdAt: '2026-07-07T15:45:00.000Z',
    updatedAt: '2026-07-07T15:45:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-10',
    name: 'Siobhán Doyle',
    picture: null,
    rating: 5,
    comment:
      'We took the devulcanized crumb on trial expecting to blend it back out. It stayed in. Same properties, lower cost, less virgin rubber.',
    createdAt: '2026-07-16T09:50:00.000Z',
    updatedAt: '2026-07-16T09:50:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-11',
    name: 'Anil Kurien',
    picture: null,
    rating: 5,
    comment:
      'Anti-vibration mounts under two compressors dropped the noise in the plant room enough that we stopped getting complaints from the floor above.',
    createdAt: '2026-07-28T11:20:00.000Z',
    updatedAt: '2026-07-28T11:20:00.000Z',
    isMine: false,
    isSample: true,
  },
  {
    id: 'sample-12',
    name: 'Grace Chikondi',
    picture: null,
    rating: 4,
    comment:
      'Tractor front tread has held up across two harvests on rough ground. Would like to see more sizes held in stock.',
    createdAt: '2026-08-04T14:05:00.000Z',
    updatedAt: '2026-08-04T14:05:00.000Z',
    isMine: false,
    isSample: true,
  },
];
