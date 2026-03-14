using Microsoft.EntityFrameworkCore;
using NexaShowroom.Domain.Entities;

namespace NexaShowroom.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Car> Cars => Set<Car>();
    public DbSet<CarVariant> CarVariants => Set<CarVariant>();
    public DbSet<CarImage> CarImages => Set<CarImage>();
    public DbSet<CarColor> CarColors => Set<CarColor>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<TestDriveBooking> TestDriveBookings => Set<TestDriveBooking>();
    public DbSet<Enquiry> Enquiries => Set<Enquiry>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Car
        modelBuilder.Entity<Car>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Slug).IsRequired().HasMaxLength(200);
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.StartingPrice).HasColumnType("decimal(18,2)");
        });

        // CarVariant
        modelBuilder.Entity<CarVariant>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Price).HasColumnType("decimal(18,2)");
            e.HasOne(x => x.Car)
             .WithMany(c => c.Variants)
             .HasForeignKey(x => x.CarId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // CarImage
        modelBuilder.Entity<CarImage>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Car)
             .WithMany(c => c.Images)
             .HasForeignKey(x => x.CarId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // CarColor
        modelBuilder.Entity<CarColor>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Car)
             .WithMany(c => c.Colors)
             .HasForeignKey(x => x.CarId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Offer
        modelBuilder.Entity<Offer>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.DiscountAmount).HasColumnType("decimal(18,2)");
            e.HasOne(x => x.Car)
             .WithMany()
             .HasForeignKey(x => x.CarId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
        });

        // TestDriveBooking
        modelBuilder.Entity<TestDriveBooking>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Car)
             .WithMany(c => c.TestDriveBookings)
             .HasForeignKey(x => x.CarId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Enquiry
        modelBuilder.Entity<Enquiry>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Car)
             .WithMany(c => c.Enquiries)
             .HasForeignKey(x => x.CarId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
        });

        // Booking
        modelBuilder.Entity<Booking>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.BookingAmount).HasColumnType("decimal(18,2)");
            e.HasIndex(x => x.BookingNumber).IsUnique();
            e.HasOne(x => x.Car)
             .WithMany(c => c.Bookings)
             .HasForeignKey(x => x.CarId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.CarVariant)
             .WithMany(v => v.Bookings)
             .HasForeignKey(x => x.CarVariantId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
        });

        // AdminUser
        modelBuilder.Entity<AdminUser>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Email).IsUnique();
        });

        // Seed default admin
        modelBuilder.Entity<AdminUser>().HasData(new AdminUser
        {
            Id = 1,
            Name = "Super Admin",
            Email = "admin@nexacar.com",
            // Password: Admin@123
            PasswordHash = "$2a$11$rE1xzFkq9y5VuqZe4jNFsO3q7G2h8Kp1mLvXwTnYsRjIdBuCA5Oom",
            Role = "SuperAdmin",
            IsActive = true,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }
}
