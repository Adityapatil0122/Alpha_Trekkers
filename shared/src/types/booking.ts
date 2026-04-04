export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';

export interface BookingParticipant {
  id: string;
  fullName: string;
  age: number;
  phone: string;
  emergencyName?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
}

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  scheduleId: string;
  numberOfPeople: number;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  discountAmount?: number;
  participants: BookingParticipant[];
  trip?: {
    title: string;
    slug: string;
    images: { url: string }[];
  };
  schedule?: {
    date: string;
  };
  payment?: {
    status: string;
    amount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  tripId: string;
  scheduleId: string;
  numberOfPeople: number;
  specialRequests?: string;
  promoCode?: string;
  participants: Omit<BookingParticipant, 'id'>[];
}
