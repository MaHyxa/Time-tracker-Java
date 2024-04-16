package MaHyxa.Time.tracker.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangeUserDetailsRequest {

    @NotEmpty
    private String newName;
    private String newLastname;
    @NotEmpty
    private String newEmail;
}
