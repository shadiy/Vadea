using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;



var builder = WebApplication.CreateBuilder(args);

var videosPath = builder.Configuration["Paths:Videos"];
if (!Directory.Exists(videosPath))
{
    Console.WriteLine("Videos path directory does not exist!. Create the directory that you set in the appsettings.json for Paths:Videos");
    return;
}

var adminPassword = builder.Configuration["Admin:Password"];
if (adminPassword == "")
{
    Console.WriteLine("Admin password is requierd. Set the admin password in appsattings.json Admin:Password");
    return;
}

// Configure SQLite and EF Core
var sqliteConnectionString =
    builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=app.db";
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(sqliteConnectionString));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login"; // Redirect if not logged in
    });
builder.Services.AddAuthorization();

builder.Services.AddProblemDetails();
builder.Services.AddAntiforgery();

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

app.MapFallbackToFile("index.html");

app.MapPost("api/login", async ([FromBody] Credentials creds, HttpContext ctx) =>
{
    //var form = await ctx.Request.ReadFormAsync();
    //var password = form["password"];

    if (creds.Password == adminPassword)
    {
        var claims = new[] { new Claim("role", "admin") };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await ctx.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        Console.WriteLine("Logged in!!");
        return Results.Ok();
    }

    return Results.Unauthorized();
}).DisableAntiforgery();

app.MapPost("api/logout", async (HttpContext ctx) =>
{
    await ctx.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Redirect("/");
});

app.MapGet("api/videos", (AppDbContext db) =>
{
    var videos = db.Videos
      .Include(v => v.Featured)
      .Select<Video, VideoResponse>(v => new VideoResponse { Name = v.Name, Featured = v.Featured != null, UploadedAt = v.UploadedAt })
      .ToArray();
    return Results.Json(videos);
});

app.MapGet("api/videos/random", async (AppDbContext db) =>
{
    var videosCount = Math.Min(db.Videos.Count(), 10);

    Random random = new Random();
    List<int> ids = new();
    for (int i = 0; i < videosCount; i++)
    {
        var skip = random.Next(0, videosCount);
        var id = await db.Videos
            .OrderBy(x => x.Id)
            .Skip(skip)
            .Select(x => x.Id)
            .FirstOrDefaultAsync();
        if (id != default)
        {
            ids.Add(id);
        }
    }

    var videos = db.Videos
      .Where(x => ids.Contains(x.Id))
      .Select(v => new VideoResponse { Name = v.Name, Featured = v.Featured != null, UploadedAt = v.UploadedAt })
      .ToArray();
    return Results.Json(videos);
});

app.MapGet("api/videos/featured", (AppDbContext db) =>
{
    var featured = db.Featured
      .Include(f => f.Video)
      .Select<Featured, FeaturedResponse>(f => new() { Name = f.Video.Name, UploadedAt = f.Video.UploadedAt })
      .ToArray();
    return Results.Json(featured);
});

app.MapGet("api/videos/{videoName}", async (string videoName, AppDbContext db) =>
{
    Video video = await db.Videos.FirstOrDefaultAsync((e) => e.Name == videoName);
    if (video is null)
    {
        return Results.NotFound("Video not found.");
    }

    string filePath = Path.Combine(videosPath, video.FileName);
    if (!File.Exists(filePath))
    {
        return Results.NotFound("Video file not found.");
    }

    // Return the file stream, optionally specifying content type and enabling range processing
    return Results.Stream(new FileStream(filePath, FileMode.Open, FileAccess.Read),
                          contentType: "video/mp4",
                          enableRangeProcessing: true);
});

app.MapPost("api/videos/{videoName}/feature", async (string videoName, AppDbContext db) =>
{
    Video video = await db.Videos.FirstOrDefaultAsync((e) => e.Name == videoName);
    if (video is null)
    {
        return Results.NotFound("Video not found.");
    }

    Featured featured = await db.Featured.FirstOrDefaultAsync((e) => e.VideoId == video.Id);
    if (featured is null)
    {
        featured = new Featured
        {
            VideoId = video.Id
        };

        await db.Featured.AddAsync(featured);
        Console.WriteLine("Added featured video: ", video.Name);
    }
    else
    {
        db.Featured.Remove(featured);
        Console.WriteLine("Removed featured video: ", video.Name);
    }

    await db.SaveChangesAsync();

    return Results.Ok();
}).RequireAuthorization();

app.MapDelete("api/videos/{videoName}", async (string videoName, AppDbContext db) =>
{
    var video = await db.Videos.Include(v => v.Featured).FirstOrDefaultAsync((e) => e.Name == videoName);
    if (video is null)
    {
        return Results.NotFound("Video not found.");
    }

    string filePath = Path.Combine(videosPath, video.FileName);
    if (!File.Exists(filePath))
    {
        return Results.NotFound("Video file not found.");
    }

    db.Videos.Remove(video);
    if (video.Featured is not null)
    {
        db.Featured.Remove(video.Featured);
    }

    await db.SaveChangesAsync();

    File.Delete(filePath);

    Console.WriteLine($"Deleted {filePath}");

    return Results.Ok();
}).RequireAuthorization();

app.MapPost("api/videos/{videoName}/rename", async (string videoName, [FromBody] RenameRequest rename, AppDbContext db) =>
{
    var video = await db.Videos.FirstOrDefaultAsync((e) => e.Name == videoName);
    if (video is null)
    {
        return Results.NotFound("Video not found.");
    }

    video.Name = rename.newName;

    await db.SaveChangesAsync();

    Console.WriteLine($"Renamed from {videoName} to {rename.newName}");

    return Results.Ok();
}).RequireAuthorization();

app.MapPost("api/upload", async (IFormFile videoFile, AppDbContext db) =>
{
    if (videoFile == null || videoFile.Length == 0)
    {
        return Results.BadRequest("No file uploaded.");
    }

    string fileName = Guid.NewGuid().ToString() + "_" + videoFile.FileName;
    string filePath = Path.Combine(videosPath, fileName);

    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await videoFile.CopyToAsync(stream);
    }

    Video video = new Video
    {
        FileName = fileName,
        Name = fileName
    };

    await db.Videos.AddAsync(video);
    await db.SaveChangesAsync();

    Console.WriteLine($"Uploaded {filePath}");

    return Results.Ok("Upload successful!");
}).DisableAntiforgery().RequireAuthorization();

app.MapGet("api/playlists", (AppDbContext db) =>
{
    var playlists = db.Playlists.Select(p => p.Name).ToArray();
    return Results.Json(playlists);
});

app.MapPost("api/playlists", async ([FromBody] NewPlaylist newPlaylist, AppDbContext db) =>
{
    var videos = await db.Videos.Where(v => newPlaylist.Videos.Contains(v.Name)).ToListAsync();

    Playlist playlist = new Playlist
    {
        Name = newPlaylist.Name,
        Videos = videos
    };

    await db.Playlists.AddAsync(playlist);
    await db.SaveChangesAsync();

    return Results.Ok();
}).RequireAuthorization();

app.MapGet("api/playlists/{name}", async (string name, AppDbContext db) =>
{
    var playlist = await db.Playlists.Include(p => p.Videos).FirstOrDefaultAsync(p => name == p.Name);
    if (playlist is null)
    {
        return Results.NotFound("Playlist not found");
    }

    var names = playlist.Videos.Select(v => v.Name).ToArray();

    return Results.Json(names);
});

app.MapDelete("api/playlists/{name}", async (string name, AppDbContext db) =>
{
    var playlist = await db.Playlists.FirstOrDefaultAsync(p => name == p.Name);
    if (playlist is null)
    {
        return Results.NotFound("Playlist not found");
    }

    db.Playlists.Remove(playlist);

    await db.SaveChangesAsync();

    return Results.Ok();
}).RequireAuthorization();

app.Run();

// Define the Event entity
[Index(nameof(FileName), IsUnique = true)]
public class Video
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [StringLength(255)]
    public string FileName { get; set; } = string.Empty;

    public Featured? Featured { get; set; }

    public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
}

[Index(nameof(VideoId), IsUnique = true)]
public class Featured
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int VideoId { get; set; }

    [ForeignKey("VideoId")]
    public Video Video { get; set; } = null!;
}

[Index(nameof(Name), IsUnique = true)]
public class Playlist
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    public ICollection<Video> Videos { get; set; } = new List<Video>();
}

// Define the DbContext
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Video> Videos => Set<Video>();
    public DbSet<Featured> Featured => Set<Featured>();
    public DbSet<Playlist> Playlists => Set<Playlist>();
}

public class Credentials
{
    public string Password { get; set; } = string.Empty;
}

class RenameRequest
{
    public string newName { get; set; } = string.Empty;
}

class VideoResponse
{
    public string Name { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public DateTime UploadedAt { get; set; }
}

class NewPlaylist
{
    public string Name { get; set; } = string.Empty;
    public string[] Videos { get; set; }
}

class FeaturedResponse
{
    public string Name { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}

public partial class Program { }
