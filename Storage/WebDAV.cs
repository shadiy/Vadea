using System.Net;
using WebDav;

public class WebDavVideoStorage : IVideoStorage
{
    private readonly WebDavClient _client;
    private readonly string _baseUrl;

    public WebDavVideoStorage(string baseUrl, string username, string password)
    {
        _baseUrl = baseUrl.TrimEnd('/') + "/";
        _client = new WebDavClient(
            new WebDavClientParams
            {
                BaseAddress = new Uri(_baseUrl),
                Credentials = new NetworkCredential(username, password),
            }
        );
    }

    private string BuildUrl(string videoName = "") =>
        $"{_baseUrl}{Uri.EscapeDataString(videoName)}";

    public async Task<Stream?> GetVideoAsync(string videoName)
    {
        var response = await _client.GetRawFile(BuildUrl(videoName));
        if (!response.IsSuccessful)
            return null;
        return response.Stream;
    }

    public async Task SaveVideoAsync(string videoName, Stream videoStream)
    {
        // Ensure the channel folder exists
        var mkcolResponse = await _client.Mkcol(BuildUrl());
        if (
            !mkcolResponse.IsSuccessful
            && mkcolResponse.StatusCode != ((int)HttpStatusCode.MethodNotAllowed)
        )
        {
            throw new Exception($"Failed to create folder: {mkcolResponse.StatusCode}");
        }

        var putResponse = await _client.PutFile(BuildUrl(videoName), videoStream);
        if (!putResponse.IsSuccessful)
        {
            throw new Exception($"Failed to upload {videoName}: {putResponse.StatusCode}");
        }
    }

    public async Task DeleteVideoAsync(string videoName)
    {
        var deleteResponse = await _client.Delete(BuildUrl(videoName));
        if (
            !deleteResponse.IsSuccessful
            && deleteResponse.StatusCode != ((int)HttpStatusCode.NotFound)
        )
        {
            throw new Exception($"Failed to delete {videoName}: {deleteResponse.StatusCode}");
        }
    }
}
