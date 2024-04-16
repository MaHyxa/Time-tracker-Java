package MaHyxa.Time.tracker.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {

    private String currentPassword;
    @NotEmpty
    private String newPassword;
    private String confirmationPassword;
}
