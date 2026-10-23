using Microsoft.AspNetCore.Identity;
namespace TMDBTest.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; } = "";
    }
}
