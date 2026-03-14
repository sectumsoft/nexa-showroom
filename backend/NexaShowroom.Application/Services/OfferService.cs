using NexaShowroom.Application.DTOs.Request;
using NexaShowroom.Application.DTOs.Response;
using NexaShowroom.Application.Interfaces;
using NexaShowroom.Domain.Entities;

namespace NexaShowroom.Application.Services;

public class OfferService : IOfferService
{
    private readonly IUnitOfWork _uow;
    public OfferService(IUnitOfWork uow) => _uow = uow;

    public async Task<ApiResponse<IEnumerable<OfferResponse>>> GetActiveOffersAsync()
    {
        var offers = await _uow.Offers.GetActiveOffersAsync();
        return ApiResponse<IEnumerable<OfferResponse>>.Ok(offers.Select(Map));
    }

    public async Task<ApiResponse<IEnumerable<OfferResponse>>> GetAllOffersAsync()
    {
        var offers = await _uow.Offers.GetAllAsync();
        return ApiResponse<IEnumerable<OfferResponse>>.Ok(offers.Select(Map));
    }

    public async Task<ApiResponse<OfferResponse>> CreateOfferAsync(CreateOfferRequest request)
    {
        var offer = new Offer
        {
            Title = request.Title,
            Description = request.Description,
            OfferType = request.OfferType,
            DiscountAmount = request.DiscountAmount,
            ValidFrom = request.ValidFrom,
            ValidUntil = request.ValidUntil,
            IsActive = request.IsActive,
            CarId = request.CarId
        };
        await _uow.Offers.AddAsync(offer);
        await _uow.SaveChangesAsync();
        return ApiResponse<OfferResponse>.Ok(Map(offer));
    }

    public async Task<ApiResponse<OfferResponse>> UpdateOfferAsync(int id, CreateOfferRequest request)
    {
        var offer = await _uow.Offers.GetByIdAsync(id);
        if (offer == null) return ApiResponse<OfferResponse>.Fail("Offer not found");
        offer.Title = request.Title;
        offer.Description = request.Description;
        offer.OfferType = request.OfferType;
        offer.DiscountAmount = request.DiscountAmount;
        offer.ValidFrom = request.ValidFrom;
        offer.ValidUntil = request.ValidUntil;
        offer.IsActive = request.IsActive;
        offer.CarId = request.CarId;
        offer.UpdatedAt = DateTime.UtcNow;
        await _uow.Offers.UpdateAsync(offer);
        await _uow.SaveChangesAsync();
        return ApiResponse<OfferResponse>.Ok(Map(offer));
    }

    public async Task<ApiResponse<bool>> DeleteOfferAsync(int id)
    {
        var offer = await _uow.Offers.GetByIdAsync(id);
        if (offer == null) return ApiResponse<bool>.Fail("Offer not found");
        await _uow.Offers.DeleteAsync(id);
        await _uow.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true);
    }

    private static OfferResponse Map(Offer o) => new()
    {
        Id = o.Id,
        Title = o.Title,
        Description = o.Description,
        ImageUrl = o.ImageUrl,
        OfferType = o.OfferType,
        DiscountAmount = o.DiscountAmount,
        ValidFrom = o.ValidFrom,
        ValidUntil = o.ValidUntil,
        IsActive = o.IsActive,
        CarId = o.CarId,
        CarName = o.Car?.Name
    };
}
