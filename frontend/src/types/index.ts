export interface Car {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  startingPrice: number;
  fuelType: string;
  transmission: string;
  isFeatured: boolean;
  primaryImageUrl?: string;
  engine: string;
  mileage?: number;
  safetyRating: string;
  seating?: number;
  variants: CarVariant[];
  images: CarImage[];
  colors: CarColor[];
}

export interface CarVariant {
  id: number;
  name: string;
  price: number;
  fuelType: string;
  transmission: string;
  engine: string;
  mileage?: number;
  features: string[];
}

export interface CarImage {
  id: number;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface CarColor {
  id: number;
  name: string;
  hexCode: string;
  imageUrl?: string;
}

export interface CarListResponse {
  cars: Car[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  offerType: string;
  discountAmount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  carId?: number;
  carName?: string;
}

export interface TestDriveBooking {
  id: number;
  carId: number;
  carName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: string;
  createdAt: string;
}

export interface Enquiry {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  message: string;
  carId?: number;
  carName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Booking {
  id: number;
  bookingNumber: string;
  carId: number;
  carName: string;
  carVariantId?: number;
  variantName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  colorPreference?: string;
  bookingAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors: string[];
}

export interface CarFilter {
  fuelType?: string;
  transmission?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface DashboardStats {
  totalCars: number;
  totalBookings: number;
  totalTestDrives: number;
  unreadEnquiries: number;
  recentBookings: Booking[];
  recentEnquiries: Enquiry[];
}
