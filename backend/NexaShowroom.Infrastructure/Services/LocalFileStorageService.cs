using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using NexaShowroom.Application.Interfaces;

namespace NexaShowroom.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly IHttpContextAccessor _accessor;

    public LocalFileStorageService(IWebHostEnvironment env, IHttpContextAccessor accessor)
    {
        _env = env;
        _accessor = accessor;
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string folder)
    {
        var uploads = Path.Combine(_env.WebRootPath, "uploads", folder);
        Directory.CreateDirectory(uploads);

        var ext = Path.GetExtension(fileName);
        var unique = $"{Guid.NewGuid()}{ext}";
        var path = Path.Combine(uploads, unique);

        using var fs = new FileStream(path, FileMode.Create);
        await fileStream.CopyToAsync(fs);

        var req = _accessor.HttpContext!.Request;
        return $"{req.Scheme}://{req.Host}/uploads/{folder}/{unique}";
    }

    public Task DeleteAsync(string fileUrl)
    {
        try
        {
            var uri = new Uri(fileUrl);
            var relativePath = uri.AbsolutePath.TrimStart('/');
            var fullPath = Path.Combine(_env.WebRootPath, relativePath);
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }
        catch { /* Log and swallow */ }
        return Task.CompletedTask;
    }
}
