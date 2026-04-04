export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export * from './user.js';
export * from './trip.js';
export * from './booking.js';
export * from './payment.js';
export * from './review.js';
export * from './admin.js';
