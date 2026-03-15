using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NexaShowroom.Application.DTOs.Request;
using NexaShowroom.Application.DTOs.Response;
using NexaShowroom.Application.Interfaces;
using NexaShowroom.Domain.Entities;

namespace NexaShowroom.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly IConfiguration _config;

    public AuthService(IUnitOfWork uow, IConfiguration config)
    {
        _uow = uow;
        _config = config;
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _uow.AdminUsers.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return ApiResponse<AuthResponse>.Fail("Invalid email or password");

        if (!user.IsActive)
            return ApiResponse<AuthResponse>.Fail("Account is disabled");

        user.LastLogin = DateTime.UtcNow;
        await _uow.AdminUsers.UpdateAsync(user);
        await _uow.SaveChangesAsync();

        var token = GenerateJwt(user);
        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            Token = token,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddHours(8)
        });
    }

    private string GenerateJwt(AdminUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role)
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class BookingService : IBookingService
{
    private readonly IUnitOfWork _uow;

    public BookingService(IUnitOfWork uow) => _uow = uow;

    public async Task<ApiResponse<BookingResponse>> CreateBookingAsync(CreateBookingRequest request)
    {
        var car = await _uow.Cars.GetByIdAsync(request.CarId);
        if (car == null) return ApiResponse<BookingResponse>.Fail("Car not found");

        var booking = new Booking
        {
            CarId = request.CarId,
            CarVariantId = request.CarVariantId,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            CustomerAddress = request.CustomerAddress,
            ColorPreference = request.ColorPreference,
            BookingAmount = request.BookingAmount,
            BookingNumber = GenerateBookingNumber(),
            PaymentStatus = "Pending",
            BookingStatus = "Active"
        };

        await _uow.Bookings.AddAsync(booking);
        await _uow.SaveChangesAsync();

        return ApiResponse<BookingResponse>.Ok(new BookingResponse
        {
            Id = booking.Id,
            BookingNumber = booking.BookingNumber,
            CarId = booking.CarId,
            CarName = car.Name,
            CustomerName = booking.CustomerName,
            CustomerEmail = booking.CustomerEmail,
            CustomerPhone = booking.CustomerPhone,
            ColorPreference = booking.ColorPreference,
            BookingAmount = booking.BookingAmount,
            PaymentStatus = booking.PaymentStatus,
            BookingStatus = booking.BookingStatus,
            CreatedAt = booking.CreatedAt
        });
    }

    public async Task<ApiResponse<BookingResponse>> GetByBookingNumberAsync(string bookingNumber)
    {
        var booking = await _uow.Bookings.GetByBookingNumberAsync(bookingNumber);
        if (booking == null) return ApiResponse<BookingResponse>.Fail("Booking not found");
        return ApiResponse<BookingResponse>.Ok(MapResponse(booking));
    }

    public async Task<ApiResponse<IEnumerable<BookingResponse>>> GetAllBookingsAsync()
    {
        var bookings = await _uow.Bookings.GetAllAsync();
        return ApiResponse<IEnumerable<BookingResponse>>.Ok(bookings.Select(MapResponse));
    }

    public async Task<ApiResponse<BookingResponse>> UpdateStatusAsync(int id, string status)
    {
        var booking = await _uow.Bookings.GetByIdAsync(id);
        if (booking == null) return ApiResponse<BookingResponse>.Fail("Booking not found");
        booking.BookingStatus = status;
        booking.UpdatedAt = DateTime.UtcNow;
        await _uow.Bookings.UpdateAsync(booking);
        await _uow.SaveChangesAsync();
        return ApiResponse<BookingResponse>.Ok(MapResponse(booking));
    }

    private static BookingResponse MapResponse(Booking b) => new()
    {
        Id = b.Id,
        BookingNumber = b.BookingNumber,
        CarId = b.CarId,
        CarName = b.Car?.Name ?? string.Empty,
        CarVariantId = b.CarVariantId,
        VariantName = b.CarVariant?.Name,
        CustomerName = b.CustomerName,
        CustomerEmail = b.CustomerEmail,
        CustomerPhone = b.CustomerPhone,
        ColorPreference = b.ColorPreference,
        BookingAmount = b.BookingAmount,
        PaymentStatus = b.PaymentStatus,
        BookingStatus = b.BookingStatus,
        CreatedAt = b.CreatedAt
    };

    private static string GenerateBookingNumber() =>
        "NXA" + DateTime.UtcNow.ToString("yyyyMMdd") + Random.Shared.Next(1000, 9999);
}

public class TestDriveService : ITestDriveService
{
    private readonly IUnitOfWork _uow;

    public TestDriveService(IUnitOfWork uow) => _uow = uow;

    public async Task<ApiResponse<TestDriveResponse>> BookTestDriveAsync(BookTestDriveRequest request)
    {
        var car = await _uow.Cars.GetByIdAsync(request.CarId);
        if (car == null) return ApiResponse<TestDriveResponse>.Fail("Car not found");

        var booking = new TestDriveBooking
        {
            CarId = request.CarId,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            PreferredDate = DateTime.SpecifyKind(request.PreferredDate, DateTimeKind.Utc),
            PreferredTime = request.PreferredTime,
            Message = request.Message,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _uow.TestDriveBookings.AddAsync(booking);
        await _uow.SaveChangesAsync();

        return ApiResponse<TestDriveResponse>.Ok(new TestDriveResponse
        {
            Id = booking.Id,
            CarId = booking.CarId,
            CarName = car.Name,
            CustomerName = booking.CustomerName,
            CustomerEmail = booking.CustomerEmail,
            CustomerPhone = booking.CustomerPhone,
            PreferredDate = booking.PreferredDate,
            PreferredTime = booking.PreferredTime,
            Message = booking.Message,
            Status = booking.Status,
            CreatedAt = booking.CreatedAt
        });
    }

    public async Task<ApiResponse<IEnumerable<TestDriveResponse>>> GetAllBookingsAsync()
    {
        var bookings = await _uow.TestDriveBookings.GetAllAsync();
        return ApiResponse<IEnumerable<TestDriveResponse>>.Ok(bookings.Select(b => new TestDriveResponse
        {
            Id = b.Id,
            CarId = b.CarId,
            CarName = b.Car?.Name ?? string.Empty,
            CustomerName = b.CustomerName,
            CustomerEmail = b.CustomerEmail,
            CustomerPhone = b.CustomerPhone,
            PreferredDate = b.PreferredDate,
            PreferredTime = b.PreferredTime,
            Message = b.Message,
            Status = b.Status,
            CreatedAt = b.CreatedAt
        }));
    }

    public async Task<ApiResponse<TestDriveResponse>> UpdateStatusAsync(int id, string status)
    {
        var booking = await _uow.TestDriveBookings.GetByIdAsync(id);
        if (booking == null) return ApiResponse<TestDriveResponse>.Fail("Booking not found");
        booking.Status = status;
        await _uow.TestDriveBookings.UpdateAsync(booking);
        await _uow.SaveChangesAsync();
        var car = await _uow.Cars.GetByIdAsync(booking.CarId);
        return ApiResponse<TestDriveResponse>.Ok(new TestDriveResponse
        {
            Id = booking.Id, CarId = booking.CarId,
            CarName = car?.Name ?? string.Empty,
            CustomerName = booking.CustomerName, CustomerEmail = booking.CustomerEmail,
            CustomerPhone = booking.CustomerPhone, PreferredDate = booking.PreferredDate,
            PreferredTime = booking.PreferredTime, Status = booking.Status,
            CreatedAt = booking.CreatedAt
        });
    }
}

public class EnquiryService : IEnquiryService
{
    private readonly IUnitOfWork _uow;

    public EnquiryService(IUnitOfWork uow) => _uow = uow;

    public async Task<ApiResponse<EnquiryResponse>> SubmitEnquiryAsync(CreateEnquiryRequest request)
    {
        var enquiry = new Enquiry
        {
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            Subject = request.Subject,
            Message = request.Message,
            CarId = request.CarId,
            IsRead = false
        };
        await _uow.Enquiries.AddAsync(enquiry);
        await _uow.SaveChangesAsync();
        return ApiResponse<EnquiryResponse>.Ok(new EnquiryResponse
        {
            Id = enquiry.Id, CustomerName = enquiry.CustomerName,
            CustomerEmail = enquiry.CustomerEmail, CustomerPhone = enquiry.CustomerPhone,
            Subject = enquiry.Subject, Message = enquiry.Message,
            CarId = enquiry.CarId, IsRead = false, CreatedAt = enquiry.CreatedAt
        });
    }

    public async Task<ApiResponse<IEnumerable<EnquiryResponse>>> GetAllEnquiriesAsync()
    {
        var enquiries = await _uow.Enquiries.GetAllAsync();
        return ApiResponse<IEnumerable<EnquiryResponse>>.Ok(enquiries.Select(e => new EnquiryResponse
        {
            Id = e.Id, CustomerName = e.CustomerName, CustomerEmail = e.CustomerEmail,
            CustomerPhone = e.CustomerPhone, Subject = e.Subject, Message = e.Message,
            CarId = e.CarId, CarName = e.Car?.Name, IsRead = e.IsRead, CreatedAt = e.CreatedAt
        }));
    }

    public async Task<ApiResponse<bool>> MarkAsReadAsync(int id)
    {
        var enquiry = await _uow.Enquiries.GetByIdAsync(id);
        if (enquiry == null) return ApiResponse<bool>.Fail("Enquiry not found");
        enquiry.IsRead = true;
        await _uow.Enquiries.UpdateAsync(enquiry);
        await _uow.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true);
    }
}
