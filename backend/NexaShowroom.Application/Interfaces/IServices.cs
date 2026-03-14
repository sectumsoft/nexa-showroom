using NexaShowroom.Application.DTOs.Request;
using NexaShowroom.Application.DTOs.Response;

namespace NexaShowroom.Application.Interfaces;

public interface ICarService
{
    Task<ApiResponse<CarListResponse>> GetCarsAsync(CarFilterRequest filter);
    Task<ApiResponse<CarDetailResponse>> GetCarBySlugAsync(string slug);
    Task<ApiResponse<IEnumerable<CarSummaryResponse>>> GetFeaturedCarsAsync();
    Task<ApiResponse<CarDetailResponse>> CreateCarAsync(CreateCarRequest request);
    Task<ApiResponse<CarDetailResponse>> UpdateCarAsync(int id, UpdateCarRequest request);
    Task<ApiResponse<bool>> DeleteCarAsync(int id);
    Task<ApiResponse<CarImage>> UploadCarImageAsync(int carId, UploadImageRequest request);
}

public interface IOfferService
{
    Task<ApiResponse<IEnumerable<OfferResponse>>> GetActiveOffersAsync();
    Task<ApiResponse<IEnumerable<OfferResponse>>> GetAllOffersAsync();
    Task<ApiResponse<OfferResponse>> CreateOfferAsync(CreateOfferRequest request);
    Task<ApiResponse<OfferResponse>> UpdateOfferAsync(int id, CreateOfferRequest request);
    Task<ApiResponse<bool>> DeleteOfferAsync(int id);
}

public interface ITestDriveService
{
    Task<ApiResponse<TestDriveResponse>> BookTestDriveAsync(BookTestDriveRequest request);
    Task<ApiResponse<IEnumerable<TestDriveResponse>>> GetAllBookingsAsync();
    Task<ApiResponse<TestDriveResponse>> UpdateStatusAsync(int id, string status);
}

public interface IEnquiryService
{
    Task<ApiResponse<EnquiryResponse>> SubmitEnquiryAsync(CreateEnquiryRequest request);
    Task<ApiResponse<IEnumerable<EnquiryResponse>>> GetAllEnquiriesAsync();
    Task<ApiResponse<bool>> MarkAsReadAsync(int id);
}

public interface IBookingService
{
    Task<ApiResponse<BookingResponse>> CreateBookingAsync(CreateBookingRequest request);
    Task<ApiResponse<BookingResponse>> GetByBookingNumberAsync(string bookingNumber);
    Task<ApiResponse<IEnumerable<BookingResponse>>> GetAllBookingsAsync();
    Task<ApiResponse<BookingResponse>> UpdateStatusAsync(int id, string status);
}

public interface IAuthService
{
    Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
}

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string folder);
    Task DeleteAsync(string fileUrl);
}
