package MaHyxa.Time.tracker.friends;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface FriendsService {

    ResponseEntity<String> requestConnect(JsonNode email, Authentication connectedUser);

    List<FriendsDTO> getAllUserFriends(Authentication connectedUser);

    ResponseEntity<?> acceptConnect(JsonNode requestBody, Authentication connectedUser);

    ResponseEntity<?> rejectConnect(JsonNode requestBody, Authentication connectedUser);
}
