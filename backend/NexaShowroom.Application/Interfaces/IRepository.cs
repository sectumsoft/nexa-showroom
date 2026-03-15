using NexaShowroom.Domain.Common;

namespace NexaShowroom.Application.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

public interface ICarRepository : IRepository<NexaShowroom.Domain.Entities.Car>
{
    Task<Domain.Entities.Car?> GetBySlugAsync(string slug);
    Task<IEnumerable<Domain.Entities.Car>> GetFeaturedCarsAsync();
    Task<(IEnumerable<Domain.Entities.Car> Cars, int Total)> GetFilteredAsync(
        string? fuelType, string? transmission, decimal? minPrice, decimal? maxPrice,
        string? category, int page, int pageSize);
    Task<Domain.Entities.Car?> GetWithDetailsAsync(int id);
}

public interface IOfferRepository : IRepository<Domain.Entities.Offer>
{
    Task<IEnumerable<Domain.Entities.Offer>> GetActiveOffersAsync();
}

public interface ITestDriveRepository : IRepository<Domain.Entities.TestDriveBooking>
{
    Task<IEnumerable<Domain.Entities.TestDriveBooking>> GetByStatusAsync(string status);
}

public interface IEnquiryRepository : IRepository<Domain.Entities.Enquiry>
{
    Task<IEnumerable<Domain.Entities.Enquiry>> GetUnreadAsync();
}

public interface IBookingRepository : IRepository<Domain.Entities.Booking>
{
    Task<Domain.Entities.Booking?> GetByBookingNumberAsync(string bookingNumber);
    Task<IEnumerable<Domain.Entities.Booking>> GetByStatusAsync(string status);
}

public interface IAdminUserRepository : IRepository<Domain.Entities.AdminUser>
{
    Task<Domain.Entities.AdminUser?> GetByEmailAsync(string email);
}

public interface IUnitOfWork : IDisposable
{
    ICarRepository Cars { get; }
    IOfferRepository Offers { get; }
    ITestDriveRepository TestDriveBookings { get; }
    IEnquiryRepository Enquiries { get; }
    IBookingRepository Bookings { get; }
    IAdminUserRepository AdminUsers { get; }
    Task<int> SaveChangesAsync();
    Task AddCarImageAsync(Domain.Entities.CarImage image);
}
