using NexaShowroom.Domain.Common;

namespace NexaShowroom.Domain.Entities;

public class CarImage : BaseEntity
{
    public int CarId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
    public Car Car { get; set; } = null!;
}

public class CarColor : BaseEntity
{
    public int CarId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string HexCode { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public Car Car { get; set; } = null!;
}

public class Offer : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string OfferType { get; set; } = string.Empty; // Discount, Finance, Exchange
    public decimal? DiscountAmount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public bool IsActive { get; set; } = true;
    public int? CarId { get; set; }
    public Car? Car { get; set; }
}

public class TestDriveBooking : BaseEntity
{
    public int CarId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public string PreferredTime { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled
    public Car Car { get; set; } = null!;
}

public class Enquiry : BaseEntity
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? CarId { get; set; }
    public bool IsRead { get; set; }
    public Car? Car { get; set; }
}

public class Booking : BaseEntity
{
    public int CarId { get; set; }
    public int? CarVariantId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerAddress { get; set; }
    public string? ColorPreference { get; set; }
    public decimal BookingAmount { get; set; }
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Refunded
    public string? TransactionId { get; set; }
    public string BookingStatus { get; set; } = "Active"; // Active, Confirmed, Cancelled
    public string BookingNumber { get; set; } = string.Empty;
    public Car Car { get; set; } = null!;
    public CarVariant? CarVariant { get; set; }
}

public class AdminUser : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Admin"; // Admin, SuperAdmin
    public bool IsActive { get; set; } = true;
    public DateTime? LastLogin { get; set; }
}
