package MaHyxa.Time.tracker.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {

  @Email(message = "Please provide a valid email address")
  @Size(min = 6, message = "Email must be at least 6 characters long")
  private String email;
  @Size(min = 6, message = "Password must be at least 6 characters long")
  private String password;
}
