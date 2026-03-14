namespace NexaShowroom.Application.DTOs.Response;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Fail(string error) =>
        new() { Success = false, Errors = new List<string> { error } };

    public static ApiResponse<T> Fail(List<string> errors) =>
        new() { Success = false, Errors = errors };
}

public class CarSummaryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public string FuelType { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public string? PrimaryImageUrl { get; set; }
}

public class CarDetailResponse : CarSummaryResponse
{
    public string Description { get; set; } = string.Empty;
    public string Engine { get; set; } = string.Empty;
    public int? Mileage { get; set; }
    public string SafetyRating { get; set; } = string.Empty;
    public int? Seating { get; set; }
    public List<CarVariantResponse> Variants { get; set; } = new();
    public List<CarImageResponse> Images { get; set; } = new();
    public List<CarColorResponse> Colors { get; set; } = new();
}

public class CarVariantResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string FuelType { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Engine { get; set; } = string.Empty;
    public int? Mileage { get; set; }
    public List<string> Features { get; set; } = new();
}

public class CarImageResponse
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}

public class CarColorResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string HexCode { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}

public class CarListResponse
{
    public IEnumerable<CarSummaryResponse> Cars { get; set; } = new List<CarSummaryResponse>();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
}

public class OfferResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string OfferType { get; set; } = string.Empty;
    public decimal? DiscountAmount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public bool IsActive { get; set; }
    public int? CarId { get; set; }
    public string? CarName { get; set; }
}

public class TestDriveResponse
{
    public int Id { get; set; }
    public int CarId { get; set; }
    public string CarName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public string PreferredTime { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class EnquiryResponse
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? CarId { get; set; }
    public string? CarName { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class BookingResponse
{
    public int Id { get; set; }
    public string BookingNumber { get; set; } = string.Empty;
    public int CarId { get; set; }
    public string CarName { get; set; } = string.Empty;
    public int? CarVariantId { get; set; }
    public string? VariantName { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? ColorPreference { get; set; }
    public decimal BookingAmount { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public string BookingStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

// Reference for CarImage used in interface
public class CarImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
