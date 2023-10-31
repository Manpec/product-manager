using productManagerApi.Models;
using Microsoft.EntityFrameworkCore;
using productManagerApi.Data;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors();

// Add services to the container.
builder.Services
  .AddAuthentication()
  .AddJwtBearer(options =>
  {
      var signingKey = Convert.FromBase64String(builder.Configuration["Jwt:SigningSecret"]);
      options.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer = false,
          ValidateAudience = false,
          IssuerSigningKey = new SymmetricSecurityKey(signingKey)
      };
  });


builder.Services.AddDbContext<ApplicationDbContext>
    (options => options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default")));


builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer abc123'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
  {
    {
      new OpenApiSecurityScheme
        {
          Reference = new OpenApiReference
            {
              Type = ReferenceType.SecurityScheme,
              Id = "Bearer"
            },
          Scheme = "oauth2",
          Name = "Bearer",
          In = ParameterLocation.Header,
        },
        new List<string>()
      }
  });

    options.SwaggerDoc(
    "v1",
    new OpenApiInfo
    {
        Title = "Product Manager API",
        Version = "1.0"
    });

    //to be able to add comments on endpoint in swagger UI 
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());


app.UseAuthorization();

app.MapControllers();

app.Run();
