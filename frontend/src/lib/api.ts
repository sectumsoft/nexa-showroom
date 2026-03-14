import { ApiResponse, Car, CarFilter, CarListResponse, Offer, TestDriveBooking, Enquiry, Booking, AuthResponse } from '@/types';

// Server-side uses the internal URL; client-side uses the public env var
const BASE_URL =
  typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost:65392/api')
    : (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:65392/api');

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('nexa_token');
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      // Prevent Next.js from caching API responses by default
      cache: options.method && options.method !== 'GET' ? 'no-store' : 'no-store',
    });

    if (!res.ok) {
      // Try to parse error body, fall back to status text
      try {
        const errData = await res.json();
        return errData as ApiResponse<T>;
      } catch {
        return { success: false, errors: [`HTTP ${res.status}: ${res.statusText}`], data: undefined };
      }
    }

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error — is the API running?';
    console.error(`[API] ${options.method || 'GET'} ${path} failed:`, message);
    return {
      success: false,
      errors: [message],
      data: undefined,
    };
  }
}

// ── Cars ──────────────────────────────────────────────────────
export const carsApi = {
  list: (filter: CarFilter = {}) => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    return request<CarListResponse>(`/cars?${params}`);
  },
  featured: () => request<Car[]>('/cars/featured'),
  bySlug: (slug: string) => request<Car>(`/cars/${slug}`),
  create: (data: Partial<Car>) =>
    request<Car>('/cars', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Car>) =>
    request<Car>(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<boolean>(`/cars/${id}`, { method: 'DELETE' }),
  uploadImage: (id: number, data: object) =>
    request<{ imageUrl: string }>(`/cars/${id}/images`, { method: 'POST', body: JSON.stringify(data) }),
};

// ── Offers ────────────────────────────────────────────────────
export const offersApi = {
  active: () => request<Offer[]>('/offers/active'),
  all: () => request<Offer[]>('/offers'),
  create: (data: Partial<Offer>) =>
    request<Offer>('/offers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Offer>) =>
    request<Offer>(`/offers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<boolean>(`/offers/${id}`, { method: 'DELETE' }),
};

// ── Test Drive ────────────────────────────────────────────────
export const testDriveApi = {
  book: (data: object) =>
    request<TestDriveBooking>('/testdrive', { method: 'POST', body: JSON.stringify(data) }),
  all: () => request<TestDriveBooking[]>('/testdrive'),
  updateStatus: (id: number, status: string) =>
    request<TestDriveBooking>(`/testdrive/${id}/status`, { method: 'PUT', body: JSON.stringify(status) }),
};

// ── Enquiries ─────────────────────────────────────────────────
export const enquiriesApi = {
  submit: (data: object) =>
    request<Enquiry>('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  all: () => request<Enquiry[]>('/enquiries'),
  markRead: (id: number) =>
    request<boolean>(`/enquiries/${id}/read`, { method: 'PUT' }),
};

// ── Bookings ──────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: object) =>
    request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  byNumber: (num: string) => request<Booking>(`/bookings/${num}`),
  all: () => request<Booking[]>('/bookings'),
  updateStatus: (id: number, status: string) =>
    request<Booking>(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify(status) }),
};

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};