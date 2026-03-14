# 🚗 Nexa Car Showroom Platform

A **production-ready, full-stack car dealership web platform** for a Nexa (Maruti Suzuki premium channel) showroom.  
Built with **Next.js 14 + ASP.NET Core 8 + SQL Server + Clean Architecture**.

---

## 📐 Architecture Overview

```
nexa-showroom/
├── backend/                          # ASP.NET Core 8 Solution
│   ├── NexaShowroom.sln
│   ├── NexaShowroom.API/             # Presentation Layer
│   │   ├── Controllers/              # REST endpoints
│   │   ├── Middleware/               # Error handling, logging
│   │   ├── Extensions/               # DI registrations
│   │   ├── appsettings.json
│   │   └── Program.cs
│   ├── NexaShowroom.Application/     # Business Logic Layer
│   │   ├── DTOs/
│   │   │   ├── Request/              # Input DTOs
│   │   │   └── Response/             # Output DTOs + ApiResponse<T>
│   │   ├── Interfaces/               # IRepository, IServices
│   │   ├── Services/                 # CarService, BookingService, AuthService…
│   │   ├── Validators/               # FluentValidation rules
│   │   └── Mappings/                 # AutoMapper profiles (optional)
│   ├── NexaShowroom.Domain/          # Core Domain
│   │   ├── Entities/                 # Car, Booking, Enquiry, AdminUser…
│   │   ├── Enums/                    # Status enums
│   │   └── Common/                   # BaseEntity
│   └── NexaShowroom.Infrastructure/  # Data + External Services
│       ├── Data/
│       │   ├── AppDbContext.cs        # EF Core context + seed
│       │   └── Configurations/       # Fluent API configs
│       ├── Repositories/             # Repository + UnitOfWork implementations
│       └── Services/                 # LocalFileStorageService
│
└── frontend/                         # Next.js 14 App
    └── src/
        ├── app/
        │   ├── layout.tsx            # Root layout (fonts, providers)
        │   ├── globals.css           # Design tokens, utility classes
        │   ├── public/               # Public-facing pages
        │   │   ├── page.tsx          # Home (hero, featured, offers)
        │   │   ├── layout.tsx        # Navbar + Footer wrapper
        │   │   ├── cars/
        │   │   │   ├── page.tsx      # Car listing with filters
        │   │   │   └── [slug]/       # Car detail page
        │   │   ├── offers/           # Promotions page
        │   │   ├── test-drive/       # Test drive booking page
        │   │   └── contact/          # Enquiry form
        │   └── admin/                # Admin panel (JWT protected)
        │       ├── layout.tsx        # Sidebar navigation
        │       ├── login/            # Admin login
        │       ├── dashboard/        # Stats overview
        │       ├── cars/             # Car CRUD
        │       ├── bookings/         # Reservation management
        │       ├── enquiries/        # Customer messages
        │       └── offers/           # Promotions CRUD
        ├── components/
        │   ├── layout/               # Navbar, Footer
        │   ├── cars/                 # CarCard
        │   └── booking/              # BookingModal, TestDriveModal
        ├── lib/
        │   ├── api.ts                # All API client functions
        │   └── utils.ts              # formatPrice, formatDate, cn()
        ├── store/
        │   └── auth.tsx              # Auth context (login/logout/token)
        └── types/
            └── index.ts              # All TypeScript interfaces
```

---

## 🗄️ Database Schema

```sql
-- Cars (master model data)
Cars (Id, Name, Slug [UNIQUE], Description, ShortDescription,
      Category, IsFeatured, IsActive, StartingPrice,
      Engine, FuelType, Transmission, Mileage, SafetyRating, Seating,
      CreatedAt, UpdatedAt)

-- Car Variants (LXI / VXI / ZXI grades)
CarVariants (Id, CarId [FK], Name, Price, FuelType, Transmission,
             Engine, Mileage, Features, IsActive, CreatedAt, UpdatedAt)

-- Car Images (multiple per car)
CarImages (Id, CarId [FK], ImageUrl, AltText, IsPrimary, SortOrder,
           CreatedAt, UpdatedAt)

-- Car Colors
CarColors (Id, CarId [FK], Name, HexCode, ImageUrl, CreatedAt, UpdatedAt)

-- Offers / Promotions
Offers (Id, Title, Description, ImageUrl, OfferType, DiscountAmount,
        ValidFrom, ValidUntil, IsActive, CarId [FK nullable],
        CreatedAt, UpdatedAt)

-- Test Drive Bookings
TestDriveBookings (Id, CarId [FK], CustomerName, CustomerEmail,
                   CustomerPhone, PreferredDate, PreferredTime,
                   Message, Status, CreatedAt, UpdatedAt)

-- Customer Enquiries
Enquiries (Id, CustomerName, CustomerEmail, CustomerPhone,
           Subject, Message, CarId [FK nullable], IsRead,
           CreatedAt, UpdatedAt)

-- Car Reservations
Bookings (Id, BookingNumber [UNIQUE], CarId [FK], CarVariantId [FK nullable],
          CustomerName, CustomerEmail, CustomerPhone, CustomerAddress,
          ColorPreference, BookingAmount, PaymentStatus,
          TransactionId, BookingStatus, CreatedAt, UpdatedAt)

-- Admin Users
AdminUsers (Id, Name, Email [UNIQUE], PasswordHash, Role,
            IsActive, LastLogin, CreatedAt, UpdatedAt)
```

---

## 🔌 REST API Endpoints

### Public Endpoints (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | List cars with filters (`fuelType`, `transmission`, `category`, `minPrice`, `maxPrice`, `page`, `pageSize`) |
| GET | `/api/cars/featured` | Get featured cars for homepage |
| GET | `/api/cars/{slug}` | Get full car detail by URL slug |
| GET | `/api/offers/active` | Get active, unexpired offers |
| POST | `/api/testdrive` | Submit test drive booking |
| POST | `/api/enquiries` | Submit contact enquiry |
| POST | `/api/bookings` | Create car reservation |
| GET | `/api/bookings/{bookingNumber}` | Track booking by number |
| POST | `/api/auth/login` | Admin login → JWT token |

### Admin Endpoints (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cars` | Create car |
| PUT | `/api/cars/{id}` | Update car |
| DELETE | `/api/cars/{id}` | Delete car |
| POST | `/api/cars/{id}/images` | Upload car image |
| GET | `/api/offers` | List all offers (incl. inactive) |
| POST | `/api/offers` | Create offer |
| PUT | `/api/offers/{id}` | Update offer |
| DELETE | `/api/offers/{id}` | Delete offer |
| GET | `/api/testdrive` | List all test drive bookings |
| PUT | `/api/testdrive/{id}/status` | Update status |
| GET | `/api/enquiries` | List all enquiries |
| PUT | `/api/enquiries/{id}/read` | Mark as read |
| GET | `/api/bookings` | List all reservations |
| PUT | `/api/bookings/{id}/status` | Update booking status |

---

## 🚀 Local Setup Guide

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| .NET SDK | 8.0+ |
| SQL Server | 2019+ (or LocalDB) |
| Git | any |

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourname/nexa-showroom.git
cd nexa-showroom
```

---

### 2. Backend Setup

#### 2a. Configure Database Connection

Edit `backend/NexaShowroom.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=NexaShowroom;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyAtLeast32Characters!",
    "Issuer": "NexaShowroomAPI",
    "Audience": "NexaShowroomClient"
  }
}
```

**For SQL Server Express / LocalDB** use:
```
Server=(localdb)\mssqllocaldb;Database=NexaShowroom;Trusted_Connection=True;
```

#### 2b. Restore and Run Migrations

```bash
cd backend

# Restore packages for all projects
dotnet restore NexaShowroom.sln

# Apply database migrations (auto-runs on startup too)
dotnet ef database update \
  --project NexaShowroom.Infrastructure \
  --startup-project NexaShowroom.API

# Run the API
cd NexaShowroom.API
dotnet run
```

API will start at: `http://localhost:5000`  
Swagger UI: `http://localhost:5000/swagger`

#### 2c. Default Admin Credentials

```
Email:    admin@nexacar.com
Password: Admin@123
```

> ⚠️ **Change these in production!**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

### 4. Environment Variables Summary

#### Backend (`appsettings.json`)
| Key | Description |
|-----|-------------|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string |
| `Jwt:Key` | JWT signing secret (min 32 chars) |
| `Jwt:Issuer` | JWT issuer string |
| `Jwt:Audience` | JWT audience string |

#### Frontend (`.env.local`)
| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## 🧪 Seeding Sample Data

Run this SQL after migrations to add sample cars:

```sql
-- Insert a sample car
INSERT INTO Cars (Name, Slug, Description, ShortDescription, Category,
                  IsFeatured, IsActive, StartingPrice, Engine, FuelType,
                  Transmission, Mileage, SafetyRating, Seating, CreatedAt, UpdatedAt)
VALUES ('Maruti Suzuki Grand Vitara',
        'grand-vitara',
        'The Grand Vitara is a bold, sophisticated SUV blending style, performance, and fuel efficiency.',
        'Bold and sophisticated SUV with advanced hybrid technology.',
        'SUV', 1, 1, 1067000,
        '1.5L BSVI Mild Hybrid', 'Petrol', 'Automatic',
        21, '5 Star GNCAP', 5,
        GETUTCDATE(), GETUTCDATE());

-- Insert variants
INSERT INTO CarVariants (CarId, Name, Price, FuelType, Transmission, Engine, Mileage, Features, IsActive, CreatedAt, UpdatedAt)
VALUES
  (1, 'Sigma', 1067000, 'Petrol', 'Manual', '1.5L BSVI', 21, 'Power Steering,AC,Power Windows', 1, GETUTCDATE(), GETUTCDATE()),
  (1, 'Delta', 1167000, 'Petrol', 'Manual', '1.5L BSVI', 21, 'Rear Camera,Keyless Entry,Auto Headlamps', 1, GETUTCDATE(), GETUTCDATE()),
  (1, 'Zeta', 1367000, 'Petrol', 'Automatic', '1.5L BSVI Mild Hybrid', 21, 'Sunroof,Heads Up Display,360 Camera', 1, GETUTCDATE(), GETUTCDATE()),
  (1, 'Alpha', 1567000, 'Petrol', 'Automatic', '1.5L BSVI Mild Hybrid', 21, 'Ventilated Seats,9" Touchscreen,JBL Sound', 1, GETUTCDATE(), GETUTCDATE());

-- Insert colors
INSERT INTO CarColors (CarId, Name, HexCode, CreatedAt, UpdatedAt)
VALUES
  (1, 'Grandeur Grey', '#6b7280', GETUTCDATE(), GETUTCDATE()),
  (1, 'Midnight Black', '#111827', GETUTCDATE(), GETUTCDATE()),
  (1, 'Pearl White', '#f9fafb', GETUTCDATE(), GETUTCDATE()),
  (1, 'Opulent Red', '#dc2626', GETUTCDATE(), GETUTCDATE());

-- Insert a sample offer
INSERT INTO Offers (Title, Description, OfferType, DiscountAmount, ValidFrom, ValidUntil, IsActive, CreatedAt, UpdatedAt)
VALUES ('Year End Bonanza', 'Get up to ₹50,000 discount on select models this festive season.',
        'Discount', 50000, GETUTCDATE(), DATEADD(month, 3, GETUTCDATE()), 1, GETUTCDATE(), GETUTCDATE());
```

---

## 🌐 Key Pages & Routes

### Public Website
| Route | Page |
|-------|------|
| `/` | Homepage (hero, featured cars, offers preview) |
| `/cars` | Car listing with sidebar filters |
| `/cars/[slug]` | Full car detail (gallery, specs, variants, colors, booking) |
| `/offers` | Active promotions and deals |
| `/test-drive` | Standalone test drive booking form |
| `/contact` | Enquiry form + contact info |

### Admin Panel
| Route | Page |
|-------|------|
| `/admin/login` | Secure login page |
| `/admin/dashboard` | Stats + recent activity |
| `/admin/cars` | Car CRUD (create, edit, delete, mark featured) |
| `/admin/bookings` | Reservation management with status updates |
| `/admin/enquiries` | Inbox-style enquiry reader |
| `/admin/offers` | Promotions CRUD |

---

## 💳 Payment Integration

The platform includes a **payment placeholder** in the booking flow.  
To integrate a real gateway, replace the placeholder in `BookingModal.tsx`:

### Razorpay (recommended for India)

```typescript
// 1. Install: npm install razorpay
// 2. Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

// 3. Initialize payment
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
  amount: BOOKING_AMOUNT * 100, // paise
  currency: 'INR',
  name: 'Nexa Cars',
  description: `Booking for ${car.name}`,
  handler: async (response: any) => {
    // Send response.razorpay_payment_id to backend
    await bookingsApi.create({ ...form, transactionId: response.razorpay_payment_id });
  },
};
const rzp = new (window as any).Razorpay(options);
rzp.open();
```

---

## 🔒 Security Considerations

| Area | Implementation |
|------|---------------|
| Passwords | BCrypt hashed (cost factor 11) |
| Authentication | JWT Bearer tokens (8hr expiry) |
| Authorization | `[Authorize]` attribute on all admin endpoints |
| CORS | Restricted to frontend origin only |
| Input validation | Required attributes + EF parameterized queries |
| SQL injection | Prevented by EF Core + LINQ |
| **Production** | Set strong JWT key, use HTTPS, use env secrets |

---

## 📦 Production Deployment

### Backend — Deploy to Azure App Service / VPS

```bash
cd backend/NexaShowroom.API
dotnet publish -c Release -o ./publish
# Upload ./publish to your server
# Set environment variables for connection string + JWT key
```

### Frontend — Deploy to Vercel

```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL to your production API URL
```

### Database — Azure SQL / AWS RDS
```bash
# Run migrations against production DB
dotnet ef database update --connection "your-production-connection-string" \
  --project NexaShowroom.Infrastructure \
  --startup-project NexaShowroom.API
```

---

## 🔧 Adding New Features

### Add a new entity (e.g., ServiceBooking)
1. Add entity class to `NexaShowroom.Domain/Entities/`
2. Add `DbSet<>` to `AppDbContext.cs`
3. Add interface to `IRepository.cs`
4. Add service interface to `IServices.cs`
5. Implement repository in `Repositories.cs`
6. Implement service in `Application/Services/`
7. Register in `Program.cs`
8. Add controller in `Controllers/`
9. Add frontend API functions in `lib/api.ts`
10. Create frontend page/component

### Add car image upload via file input (instead of base64)
Replace the `UploadImageRequest` in the controller to accept `IFormFile`:
```csharp
[HttpPost("{id:int}/images"), Authorize]
public async Task<IActionResult> UploadImage(int id, IFormFile file)
{
    using var stream = file.OpenReadStream();
    var url = await _fileStorage.UploadAsync(stream, file.FileName, "cars");
    // Save to DB...
}
```

---

## 📋 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| UI Components | Custom with Tailwind CSS |
| Icons | Lucide React |
| Fonts | Cormorant Garamond (display) + DM Sans (body) |
| Backend Framework | ASP.NET Core 8 Web API |
| Architecture | Clean Architecture + Repository Pattern |
| ORM | Entity Framework Core 8 |
| Database | SQL Server 2019+ |
| Authentication | JWT Bearer Tokens |
| Password Hashing | BCrypt.Net |
| File Storage | Local filesystem (swap for Azure Blob/S3) |
| API Documentation | Swagger / OpenAPI |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for commercial and personal projects.

---

*Built for Nexa Dealerships — Production-ready from day one.*
