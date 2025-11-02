public class LocalVideoStorage : IVideoStorage
{
    private readonly string _basePath;

    public LocalVideoStorage(string basePath)
    {
        _basePath = basePath;
    }

    public Task<Stream?> GetVideoAsync(string videoName)
    {
        string path = Path.Combine(_basePath, videoName);
        if (!File.Exists(path)) return Task.FromResult<Stream?>(null);
        return Task.FromResult<Stream?>(File.OpenRead(path));
    }

    public async Task SaveVideoAsync(string videoName, Stream videoStream)
    {
        Directory.CreateDirectory(_basePath);

        string path = Path.Combine(_basePath, videoName);
        using var fileStream = File.Create(path);
        await videoStream.CopyToAsync(fileStream);
    }

    public Task DeleteVideoAsync(string videoName)
    {
        string path = Path.Combine(_basePath, videoName);
        if (File.Exists(path)) File.Delete(path);
        return Task.CompletedTask;
    }
}
