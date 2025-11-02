using Amazon.S3;
using Amazon.S3.Model;

public class S3VideoStorage : IVideoStorage
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3VideoStorage(string bucketName, string region, string accessKey, string secretKey, string? endpoint = null)
    {
        var config = new AmazonS3Config
        {
            RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(region),
            ForcePathStyle = true // needed for some S3-compatible services like MinIO
        };

        if (!string.IsNullOrEmpty(endpoint))
            config.ServiceURL = endpoint;

        _s3Client = new AmazonS3Client(accessKey, secretKey, config);
        _bucketName = bucketName;
    }

    public async Task<Stream?> GetVideoAsync(string videoName)
    {
        try
        {
            var response = await _s3Client.GetObjectAsync(_bucketName, $"{videoName}");
            return response.ResponseStream;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task SaveVideoAsync(string videoName, Stream videoStream)
    {
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = $"{videoName}",
            InputStream = videoStream
        };

        await _s3Client.PutObjectAsync(request);
    }

    public async Task DeleteVideoAsync(string videoName)
    {
        await _s3Client.DeleteObjectAsync(_bucketName, $"{videoName}");
    }
}
