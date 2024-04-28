package MaHyxa.Time.tracker.user;

import com.fasterxml.jackson.databind.JsonNode;
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

    @GetMapping("/info")
    public ResponseEntity<UserResponse> getUser(Principal connectedUser) {
        return ResponseEntity.ok(service.getUser(connectedUser));
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(
          @Valid @RequestBody ChangePasswordRequest request,
          Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/changeUserDetails")
    public ResponseEntity<UserResponse> changeUserDetails(@RequestBody JsonNode requestBody, Principal connectedUser)
    {
        return ResponseEntity.ok(service.changeUserDetails(requestBody, connectedUser));
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(String password, Principal connectedUser) {
        service.deleteUser(password, connectedUser);
        return ResponseEntity.ok().build();
    }
}
