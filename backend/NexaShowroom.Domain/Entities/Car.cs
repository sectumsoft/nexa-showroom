using NexaShowroom.Domain.Common;

namespace NexaShowroom.Domain.Entities;

public class Car : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // SUV, Sedan, Hatchback etc.
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;
    public decimal StartingPrice { get; set; }

    // Specs
    public string Engine { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;   // Petrol, Diesel, CNG, Electric
    public string Transmission { get; set; } = string.Empty; // Manual, Automatic, AMT
    public int? Mileage { get; set; }
    public string SafetyRating { get; set; } = string.Empty;
    public int? Seating { get; set; }

    public ICollection<CarVariant> Variants { get; set; } = new List<CarVariant>();
    public ICollection<CarImage> Images { get; set; } = new List<CarImage>();
    public ICollection<CarColor> Colors { get; set; } = new List<CarColor>();
    public ICollection<TestDriveBooking> TestDriveBookings { get; set; } = new List<TestDriveBooking>();
    public ICollection<Enquiry> Enquiries { get; set; } = new List<Enquiry>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
