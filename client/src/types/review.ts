export interface Review {
  id: string;
  /** Google display name and avatar, as they were when the review was written. */
  name: string;
  picture: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  /** True for the signed-in reader's own review, which they can edit. */
  isMine: boolean;
  /**
   * Set only on the placeholder reviews in `data/sampleReviews`. The server
   * never sends it. A card with this flag drops the "Signed in with Google"
   * line and the Verified chip, because neither is true of an invented
   * reviewer — the design may be a placeholder, the claim may not be.
   */
  isSample?: boolean;
}

export interface ReviewSummary {
  reviews: Review[];
  count: number;
  average: number;
}

export interface ReviewsResponse {
  ok: boolean;
  message: string;
  data?: ReviewSummary;
}

export interface ReviewResponse {
  ok: boolean;
  message: string;
  data?: { review: Review };
}

export interface ReviewDraft {
  rating: number;
  comment: string;
}
