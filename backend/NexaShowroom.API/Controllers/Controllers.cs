using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexaShowroom.Application.DTOs.Request;
using NexaShowroom.Application.Interfaces;

namespace NexaShowroom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly ICarService _carService;
    public CarsController(ICarService carService) => _carService = carService;

    [HttpGet]
    public async Task<IActionResult> GetCars([FromQuery] CarFilterRequest filter)
    {
        var result = await _carService.GetCarsAsync(filter);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var result = await _carService.GetFeaturedCarsAsync();
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _carService.GetCarBySlugAsync(slug);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost, Authorize]
    public async Task<IActionResult> Create([FromBody] CreateCarRequest request)
    {
        var result = await _carService.CreateCarAsync(request);
        return CreatedAtAction(nameof(GetBySlug), new { slug = result.Data?.Slug }, result);
    }

    [HttpPut("{id:int}"), Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCarRequest request)
    {
        var result = await _carService.UpdateCarAsync(id, request);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpDelete("{id:int}"), Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _carService.DeleteCarAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost("{id:int}/images"), Authorize]
    public async Task<IActionResult> UploadImage(int id, [FromBody] UploadImageRequest request)
    {
        var result = await _carService.UploadCarImageAsync(id, request);
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class OffersController : ControllerBase
{
    private readonly IOfferService _offerService;
    public OffersController(IOfferService offerService) => _offerService = offerService;

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
        => Ok(await _offerService.GetActiveOffersAsync());

    [HttpGet, Authorize]
    public async Task<IActionResult> GetAll()
        => Ok(await _offerService.GetAllOffersAsync());

    [HttpPost, Authorize]
    public async Task<IActionResult> Create([FromBody] CreateOfferRequest request)
        => Ok(await _offerService.CreateOfferAsync(request));

    [HttpPut("{id:int}"), Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] CreateOfferRequest request)
        => Ok(await _offerService.UpdateOfferAsync(id, request));

    [HttpDelete("{id:int}"), Authorize]
    public async Task<IActionResult> Delete(int id)
        => Ok(await _offerService.DeleteOfferAsync(id));
}

[ApiController]
[Route("api/[controller]")]
public class TestDriveController : ControllerBase
{
    private readonly ITestDriveService _service;
    public TestDriveController(ITestDriveService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Book([FromBody] BookTestDriveRequest request)
    {
        var result = await _service.BookTestDriveAsync(request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet, Authorize]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllBookingsAsync());

    [HttpPut("{id:int}/status"), Authorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var result = await _service.UpdateStatusAsync(id, status);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class EnquiriesController : ControllerBase
{
    private readonly IEnquiryService _service;
    public EnquiriesController(IEnquiryService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateEnquiryRequest request)
    {
        var result = await _service.SubmitEnquiryAsync(request);
        return Ok(result);
    }

    [HttpGet, Authorize]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllEnquiriesAsync());

    [HttpPut("{id:int}/read"), Authorize]
    public async Task<IActionResult> MarkRead(int id)
        => Ok(await _service.MarkAsReadAsync(id));
}

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _service;
    public BookingsController(IBookingService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request)
    {
        var result = await _service.CreateBookingAsync(request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{bookingNumber}")]
    public async Task<IActionResult> GetByNumber(string bookingNumber)
    {
        var result = await _service.GetByBookingNumberAsync(bookingNumber);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet, Authorize]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllBookingsAsync());

    [HttpPut("{id:int}/status"), Authorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        => Ok(await _service.UpdateStatusAsync(id, status));
}

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (!result.Success) return Unauthorized(result);
        return Ok(result);
    }
}
