namespace NexaShowroom.Application.DTOs.Request;

public class CarFilterRequest
{
    public string? FuelType { get; set; }
    public string? Transmission { get; set; }
    public string? Category { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}

public class CreateCarRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public decimal StartingPrice { get; set; }
    public string Engine { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public int? Mileage { get; set; }
    public string SafetyRating { get; set; } = string.Empty;
    public int? Seating { get; set; }
}

public class UpdateCarRequest : CreateCarRequest { }

public class CreateVariantRequest
{
    public int CarId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string FuelType { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Engine { get; set; } = string.Empty;
    public int? Mileage { get; set; }
    public string Features { get; set; } = string.Empty;
}

public class BookTestDriveRequest
{
    public int CarId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public string PreferredTime { get; set; } = string.Empty;
    public string? Message { get; set; }
}

public class CreateEnquiryRequest
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? CarId { get; set; }
}

public class CreateBookingRequest
{
    public int CarId { get; set; }
    public int? CarVariantId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerAddress { get; set; }
    public string? ColorPreference { get; set; }
    public decimal BookingAmount { get; set; }
}

public class CreateOfferRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OfferType { get; set; } = string.Empty;
    public decimal? DiscountAmount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public bool IsActive { get; set; } = true;
    public int? CarId { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UploadImageRequest
{
    public string Base64Image { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public string AltText { get; set; } = string.Empty;
}
