using Microsoft.EntityFrameworkCore;
using NexaShowroom.Application.Interfaces;
using NexaShowroom.Domain.Common;
using NexaShowroom.Domain.Entities;
using NexaShowroom.Infrastructure.Data;

namespace NexaShowroom.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _db;
    protected readonly DbSet<T> _set;

    public Repository(AppDbContext db)
    {
        _db = db;
        _set = db.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id) => await _set.FindAsync(id);
    public async Task<IEnumerable<T>> GetAllAsync() => await _set.ToListAsync();
    public async Task<T> AddAsync(T entity) { await _set.AddAsync(entity); return entity; }
    public Task UpdateAsync(T entity) { _db.Entry(entity).State = EntityState.Modified; return Task.CompletedTask; }
    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null) _set.Remove(entity);
    }
}

public class CarRepository : Repository<Car>, ICarRepository
{
    public CarRepository(AppDbContext db) : base(db) { }

    public async Task<Car?> GetBySlugAsync(string slug) =>
        await _db.Cars
            .Include(c => c.Images)
            .Include(c => c.Variants)
            .Include(c => c.Colors)
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);

    public async Task<IEnumerable<Car>> GetFeaturedCarsAsync() =>
        await _db.Cars
            .Include(c => c.Images)
            .Where(c => c.IsFeatured && c.IsActive)
            .ToListAsync();

    public async Task<(IEnumerable<Car> Cars, int Total)> GetFilteredAsync(
        string? fuelType, string? transmission, decimal? minPrice, decimal? maxPrice,
        string? category, int page, int pageSize)
    {
        var query = _db.Cars
            .Include(c => c.Images)
            .Where(c => c.IsActive)
            .AsQueryable();

        if (!string.IsNullOrEmpty(fuelType)) query = query.Where(c => c.FuelType == fuelType);
        if (!string.IsNullOrEmpty(transmission)) query = query.Where(c => c.Transmission == transmission);
        if (!string.IsNullOrEmpty(category)) query = query.Where(c => c.Category == category);
        if (minPrice.HasValue) query = query.Where(c => c.StartingPrice >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(c => c.StartingPrice <= maxPrice.Value);

        var total = await query.CountAsync();
        var cars = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (cars, total);
    }

    public async Task<Car?> GetWithDetailsAsync(int id) =>
        await _db.Cars
            .Include(c => c.Images)
            .Include(c => c.Variants)
            .Include(c => c.Colors)
            .FirstOrDefaultAsync(c => c.Id == id);
}

public class BookingRepository : Repository<Booking>, IBookingRepository
{
    public BookingRepository(AppDbContext db) : base(db) { }

    public async Task<Booking?> GetByBookingNumberAsync(string bookingNumber) =>
        await _db.Bookings
            .Include(b => b.Car)
            .Include(b => b.CarVariant)
            .FirstOrDefaultAsync(b => b.BookingNumber == bookingNumber);

    public async Task<IEnumerable<Booking>> GetByStatusAsync(string status) =>
        await _db.Bookings
            .Include(b => b.Car)
            .Include(b => b.CarVariant)
            .Where(b => b.BookingStatus == status)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

    public new async Task<IEnumerable<Booking>> GetAllAsync() =>
        await _db.Bookings
            .Include(b => b.Car)
            .Include(b => b.CarVariant)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
}

public class TestDriveRepository : Repository<TestDriveBooking>, ITestDriveRepository
{
    public TestDriveRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<TestDriveBooking>> GetByStatusAsync(string status) =>
        await _db.TestDriveBookings
            .Include(b => b.Car)
            .Where(b => b.Status == status)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

    public new async Task<IEnumerable<TestDriveBooking>> GetAllAsync() =>
        await _db.TestDriveBookings
            .Include(b => b.Car)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
}

public class EnquiryRepository : Repository<Enquiry>, IEnquiryRepository
{
    public EnquiryRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Enquiry>> GetUnreadAsync() =>
        await _db.Enquiries
            .Include(e => e.Car)
            .Where(e => !e.IsRead)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

    public new async Task<IEnumerable<Enquiry>> GetAllAsync() =>
        await _db.Enquiries
            .Include(e => e.Car)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
}

public class OfferRepository : Repository<Offer>, IOfferRepository
{
    public OfferRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Offer>> GetActiveOffersAsync() =>
        await _db.Offers
            .Include(o => o.Car)
            .Where(o => o.IsActive && o.ValidUntil >= DateTime.UtcNow)
            .OrderBy(o => o.ValidUntil)
            .ToListAsync();
}

public class AdminUserRepository : Repository<AdminUser>, IAdminUserRepository
{
    public AdminUserRepository(AppDbContext db) : base(db) { }

    public async Task<AdminUser?> GetByEmailAsync(string email) =>
        await _db.AdminUsers.FirstOrDefaultAsync(u => u.Email == email);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;

    public ICarRepository Cars { get; }
    public IOfferRepository Offers { get; }
    public ITestDriveRepository TestDriveBookings { get; }
    public IEnquiryRepository Enquiries { get; }
    public IBookingRepository Bookings { get; }
    public IAdminUserRepository AdminUsers { get; }

    public UnitOfWork(AppDbContext db)
    {
        _db = db;
        Cars = new CarRepository(db);
        Offers = new OfferRepository(db);
        TestDriveBookings = new TestDriveRepository(db);
        Enquiries = new EnquiryRepository(db);
        Bookings = new BookingRepository(db);
        AdminUsers = new AdminUserRepository(db);
    }

    public async Task<int> SaveChangesAsync() => await _db.SaveChangesAsync();
    public void Dispose() => _db.Dispose();
}
