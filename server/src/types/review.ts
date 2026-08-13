export interface ReviewInput {
  /** Whole stars, 1–5. */
  rating: number;
  comment: string;
}

export interface ReviewRecord extends ReviewInput {
  id: string;
  /** Author. One review per account — a second submission edits the first. */
  userId: string;
  /** Name and avatar are copied from Google at the time of writing, so a
      review keeps the identity it was published under. */
  name: string;
  picture: string | null;
  createdAt: string;
  updatedAt: string;
}

/** What the browser is allowed to see — no user ids, no email addresses. */
export interface PublicReview {
  id: string;
  name: string;
  picture: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  /** True when the review belongs to whoever is asking. */
  isMine: boolean;
}

export interface ReviewSummary {
  reviews: PublicReview[];
  count: number;
  /** Mean rating to one decimal place, or 0 when there are no reviews. */
  average: number;
}
