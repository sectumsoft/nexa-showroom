using NexaShowroom.Domain.Common;

namespace NexaShowroom.Domain.Entities;

public class CarVariant : BaseEntity
{
    public int CarId { get; set; }
    public string Name { get; set; } = string.Empty;       // LXI, VXI, ZXI, etc.
    public decimal Price { get; set; }
    public string FuelType { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Engine { get; set; } = string.Empty;
    public int? Mileage { get; set; }
    public bool IsActive { get; set; } = true;

    // Features JSON or comma-separated
    public string Features { get; set; } = string.Empty;

    public Car Car { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
