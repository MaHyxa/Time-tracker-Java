package MaHyxa.Time.tracker.auth;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @Size(min = 2, message = "Full name must be at least 2 characters long")
  @NotNull(message = "Full name cannot be null")
  private String fullName;
  @Email(message = "Please provide a valid email address")
  @Size(min = 6, message = "Email must be at least 6 characters long")
  @NotNull(message = "Email cannot be null")
  private String email;
  @Size(min = 6, message = "Password must be at least 6 characters long")
  @NotNull(message = "Password cannot be null")
  private String password;
}
