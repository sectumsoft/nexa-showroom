using NexaShowroom.Application.DTOs.Request;
using NexaShowroom.Application.DTOs.Response;
using NexaShowroom.Application.Interfaces;
using NexaShowroom.Domain.Entities;

namespace NexaShowroom.Application.Services;

public class CarService : ICarService
{
    private readonly IUnitOfWork _uow;
    private readonly IFileStorageService _fileStorage;

    public CarService(IUnitOfWork uow, IFileStorageService fileStorage)
    {
        _uow = uow;
        _fileStorage = fileStorage;
    }

    public async Task<ApiResponse<CarListResponse>> GetCarsAsync(CarFilterRequest filter)
    {
        var (cars, total) = await _uow.Cars.GetFilteredAsync(
            filter.FuelType, filter.Transmission,
            filter.MinPrice, filter.MaxPrice,
            filter.Category, filter.Page, filter.PageSize);

        var result = new CarListResponse
        {
            Cars = cars.Select(MapToSummary),
            Total = total,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
        return ApiResponse<CarListResponse>.Ok(result);
    }

    public async Task<ApiResponse<CarDetailResponse>> GetCarBySlugAsync(string slug)
    {
        var car = await _uow.Cars.GetBySlugAsync(slug);
        if (car == null) return ApiResponse<CarDetailResponse>.Fail("Car not found");
        return ApiResponse<CarDetailResponse>.Ok(MapToDetail(car));
    }

    public async Task<ApiResponse<IEnumerable<CarSummaryResponse>>> GetFeaturedCarsAsync()
    {
        var cars = await _uow.Cars.GetFeaturedCarsAsync();
        return ApiResponse<IEnumerable<CarSummaryResponse>>.Ok(cars.Select(MapToSummary));
    }

    public async Task<ApiResponse<CarDetailResponse>> CreateCarAsync(CreateCarRequest request)
    {
        var car = new Car
        {
            Name = request.Name,
            Slug = GenerateSlug(request.Name),
            Description = request.Description,
            ShortDescription = request.ShortDescription,
            Category = request.Category,
            IsFeatured = request.IsFeatured,
            StartingPrice = request.StartingPrice,
            Engine = request.Engine,
            FuelType = request.FuelType,
            Transmission = request.Transmission,
            Mileage = request.Mileage,
            SafetyRating = request.SafetyRating,
            Seating = request.Seating
        };
        await _uow.Cars.AddAsync(car);
        await _uow.SaveChangesAsync();
        var created = await _uow.Cars.GetWithDetailsAsync(car.Id);
        return ApiResponse<CarDetailResponse>.Ok(MapToDetail(created!));
    }

    public async Task<ApiResponse<CarDetailResponse>> UpdateCarAsync(int id, UpdateCarRequest request)
    {
        var car = await _uow.Cars.GetByIdAsync(id);
        if (car == null) return ApiResponse<CarDetailResponse>.Fail("Car not found");

        car.Name = request.Name;
        car.Description = request.Description;
        car.ShortDescription = request.ShortDescription;
        car.Category = request.Category;
        car.IsFeatured = request.IsFeatured;
        car.StartingPrice = request.StartingPrice;
        car.Engine = request.Engine;
        car.FuelType = request.FuelType;
        car.Transmission = request.Transmission;
        car.Mileage = request.Mileage;
        car.SafetyRating = request.SafetyRating;
        car.Seating = request.Seating;
        car.UpdatedAt = DateTime.UtcNow;

        await _uow.Cars.UpdateAsync(car);
        await _uow.SaveChangesAsync();
        var updated = await _uow.Cars.GetWithDetailsAsync(car.Id);
        return ApiResponse<CarDetailResponse>.Ok(MapToDetail(updated!));
    }

    public async Task<ApiResponse<bool>> DeleteCarAsync(int id)
    {
        var car = await _uow.Cars.GetByIdAsync(id);
        if (car == null) return ApiResponse<bool>.Fail("Car not found");
        await _uow.Cars.DeleteAsync(id);
        await _uow.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true);
    }

public async Task<ApiResponse<DTOs.Response.CarImage>> UploadCarImageAsync(int carId, UploadImageRequest request){
    var imageUrl = !string.IsNullOrEmpty(request.ImageUrl)
        ? request.ImageUrl
        : string.Empty;

    var carImage = new Domain.Entities.CarImage
    {
        CarId = carId,
        ImageUrl = imageUrl,
        AltText = request.AltText,
        IsPrimary = request.IsPrimary,
        SortOrder = 0,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    await _uow.AddCarImageAsync(carImage);
    await _uow.SaveChangesAsync();

    return ApiResponse<DTOs.Response.CarImage>.Ok(new DTOs.Response.CarImage { ImageUrl = imageUrl });
}
    private static CarSummaryResponse MapToSummary(Car c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Slug = c.Slug,
        ShortDescription = c.ShortDescription,
        Category = c.Category,
        StartingPrice = c.StartingPrice,
        FuelType = c.FuelType,
        Transmission = c.Transmission,
        IsFeatured = c.IsFeatured,
        PrimaryImageUrl = c.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl
                          ?? c.Images.FirstOrDefault()?.ImageUrl
    };

    private static CarDetailResponse MapToDetail(Car c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Slug = c.Slug,
        Description = c.Description,
        ShortDescription = c.ShortDescription,
        Category = c.Category,
        StartingPrice = c.StartingPrice,
        FuelType = c.FuelType,
        Transmission = c.Transmission,
        IsFeatured = c.IsFeatured,
        Engine = c.Engine,
        Mileage = c.Mileage,
        SafetyRating = c.SafetyRating,
        Seating = c.Seating,
        PrimaryImageUrl = c.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl,
        Variants = c.Variants.Select(v => new CarVariantResponse
        {
            Id = v.Id,
            Name = v.Name,
            Price = v.Price,
            FuelType = v.FuelType,
            Transmission = v.Transmission,
            Engine = v.Engine,
            Mileage = v.Mileage,
            Features = v.Features.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
        }).ToList(),
        Images = c.Images.OrderBy(i => i.SortOrder).Select(i => new CarImageResponse
        {
            Id = i.Id,
            ImageUrl = i.ImageUrl,
            AltText = i.AltText,
            IsPrimary = i.IsPrimary,
            SortOrder = i.SortOrder
        }).ToList(),
        Colors = c.Colors.Select(col => new CarColorResponse
        {
            Id = col.Id,
            Name = col.Name,
            HexCode = col.HexCode,
            ImageUrl = col.ImageUrl
        }).ToList()
    };

    private static string GenerateSlug(string name) =>
        name.ToLower().Replace(" ", "-").Replace("'", "").Replace(".", "");
}
