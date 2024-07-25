package MaHyxa.Time.tracker.friends;

import MaHyxa.Time.tracker.task.Task;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendsController {

    public final FriendsService friendsService;

    @GetMapping("/my-friends")
    public ResponseEntity<List<FriendsDTO>> getAllFriendsByUserId(Authentication connectedUser) {
        return ResponseEntity.ok(friendsService.getAllFriendsByUser(connectedUser));
    }

    @PostMapping("/addFriend")
    public ResponseEntity<String> addFriend(@RequestBody JsonNode email, Authentication connectedUser) {
        if (email == null || !email.hasNonNull("email") || email.get("email").asText().isEmpty()) {
            return new ResponseEntity<>("Email cannot be empty.", HttpStatus.BAD_REQUEST);
        }
        else {
            return friendsService.addFriend(email, connectedUser);
        }
    }

    @PatchMapping("my-friends/acceptConnect")
    public ResponseEntity<?> acceptConnect(@RequestBody JsonNode sender, Authentication connectedUser) {
        if (sender == null || sender.asText().isEmpty()) {
            return new ResponseEntity<>("Email cannot be empty.", HttpStatus.BAD_REQUEST);
        }
        else {
            return friendsService.acceptConnect(sender, connectedUser);
        }
    }

    @DeleteMapping("my-friends/rejectConnect")
    public ResponseEntity<?> rejectConnect(@RequestBody JsonNode sender, Authentication connectedUser) {
        if (sender == null || sender.asText().isEmpty()) {
            return new ResponseEntity<>("Email cannot be empty.", HttpStatus.BAD_REQUEST);
        }
        else {
            return friendsService.rejectConnect(sender, connectedUser);
        }
    }

}
