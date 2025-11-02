public interface IVideoStorage
{
    Task<Stream?> GetVideoAsync(string videoName);
    Task SaveVideoAsync(string videoName, Stream videoStream);
    Task DeleteVideoAsync(string videoName);
}
