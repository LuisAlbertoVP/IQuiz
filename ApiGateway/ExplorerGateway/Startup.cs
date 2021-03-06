using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Microsoft.AspNetCore.HttpOverrides;
using System.Net;
using Ocelot.Middleware;


namespace ExplorerGateway
{
    public class Startup
    {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {
            services.AddCors(options => {
                options.AddPolicy("CorsPolicy", builder => 
                    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader());
            });
            services.AddAuthentication().AddJwtBearer("IdentityApiKey", config => {
                config.TokenValidationParameters = new TokenValidationParameters {
                    ValidIssuer = Configuration["Tokens:Issuer"],
                    ValidAudience = Configuration["Tokens:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration["Tokens:Key"])),
                    ClockSkew = TimeSpan.Zero
                };
            });
            services.AddOcelot(Configuration);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            app.UseForwardedHeaders(new ForwardedHeadersOptions {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseCors("CorsPolicy");
            app.UseOcelot().Wait();
        }
    }
}
