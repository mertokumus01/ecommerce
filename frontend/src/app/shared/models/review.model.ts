/**
 * Review Model
 */
export interface Review {
  reviewId?: number;
  id?: number;
  productId: number;
  userId: number;
  reviewComment: string;
  reviewRating: number;
  reviewCreatedDate?: Date;
  createdDate?: Date;
  createdAt?: Date;
  reviewerName?: string;
  userName?: string;
}

export interface ReviewRequest {
  productId: number;
  userId: number;
  reviewComment: string;
  reviewRating: number;
}

export interface ReviewResponse {
  success: boolean;
  data?: Review | Review[];
  message?: string;
}
