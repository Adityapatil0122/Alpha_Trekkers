export interface Review {
  id: string;
  userId: string;
  tripId: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  user?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  tripId: string;
  rating: number;
  title?: string;
  comment: string;
}
