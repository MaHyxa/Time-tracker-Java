package MaHyxa.Time.tracker.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(
          @Valid @RequestBody ChangePasswordRequest request,
          Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/changeUserDetails")
    public ResponseEntity<?> changeUserDetails(
            @Valid @RequestBody ChangeUserDetailsRequest request, Principal connectedUser)
    {
        service.changeUserDetails(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(String password, Principal connectedUser) {
        service.deleteUser(password, connectedUser);
        return ResponseEntity.ok().build();
    }
}
