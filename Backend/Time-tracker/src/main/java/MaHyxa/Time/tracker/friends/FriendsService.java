package MaHyxa.Time.tracker.friends;

import MaHyxa.Time.tracker.config.databases.keycloak.UserRepositoryCustom;
import MaHyxa.Time.tracker.task.Task;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendsService {

    private final FriendsRepository friendsRepository;
    private final UserRepositoryCustom userRepositoryCustom;

    private Friends.Status isFriends(String friendOne, String friendTwo) {
        return friendsRepository.checkFriends(friendOne, friendTwo);
    }

    public ResponseEntity<String> addFriend(JsonNode email, Authentication connectedUser) {
        String friendOne = userRepositoryCustom.getUserEmailById(connectedUser.getName());
        String friendTwo = userRepositoryCustom.getUserEmail(email.get("email").asText());

        if (friendTwo != null && friendOne != null) {
            if (friendOne.equals(friendTwo)) {
                return new ResponseEntity<>("You can't connect to yourself", HttpStatus.BAD_REQUEST);
            }

            if (isFriends(friendOne, friendTwo) == Friends.Status.ONE) {
                return new ResponseEntity<>("You are already connected with this user.", HttpStatus.CONFLICT);
            }
            else if (isFriends(friendOne, friendTwo) == Friends.Status.ZERO) {
                return new ResponseEntity<>("You've already sent request to this user. Please wait for acceptance.", HttpStatus.CONFLICT);
            }
            else {
                Friends friend = Friends.builder()
                        .friendOne(friendOne)
                        .friendTwo(friendTwo)
                        .status(Friends.Status.ZERO)
                        .build();
                friendsRepository.save(friend);
                return new ResponseEntity<>("Request successfully sent.", HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>("User wasn't found in our service.", HttpStatus.NOT_FOUND);
        }
    }


    public List<FriendsDTO> getAllFriendsByUser(Authentication connectedUser) {
        String user = userRepositoryCustom.getUserEmailById(connectedUser.getName());
        List<Friends> temp = friendsRepository.getAllFriendsByUser(user);

        List<FriendsDTO> friendNames = temp.stream()
                .map(friend -> FriendsDTO.builder()
//                        .friend(friend.getFriendOne().equals(user) ? friend.getFriendTwo() : friend.getFriendOne())
                        .friendOne(friend.getFriendOne())
                        .friendTwo(friend.getFriendTwo())
                        .status(friend.getStatus().ordinal())
                        .build())
                .collect(Collectors.toList());
        return friendNames;
    }


    public ResponseEntity<?> acceptConnect(JsonNode requestBody, Authentication connectedUser) {
        String user = userRepositoryCustom.getUserEmailById(connectedUser.getName());
        String sender = requestBody.asText();
        List<Friends> temp = friendsRepository.getAllFriendsByUser(user);
        Optional<Friends> found = temp.stream()
                .filter(friend -> friend.getFriendOne().equals(sender) && friend.getFriendTwo().equals(user))
                .findFirst();

        try {
            if (found.isPresent()) {
                Friends foundFriend = found.get();
                foundFriend.setStatus(Friends.Status.ONE);
                friendsRepository.save(foundFriend);
                FriendsDTO friendsDTO = FriendsDTO.builder()
                        .friendOne(foundFriend.getFriendOne())
                        .friendTwo(foundFriend.getFriendTwo())
                        .status(foundFriend.getStatus().ordinal())
                        .build();
                return ResponseEntity.ok().body(friendsDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Connection wasn't found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error accepting friend request.");
        }
    }
    public ResponseEntity<?> rejectConnect(JsonNode requestBody, Authentication connectedUser) {
        String user = userRepositoryCustom.getUserEmailById(connectedUser.getName());
        String sender = requestBody.asText();
        List<Friends> temp = friendsRepository.getAllFriendsByUser(user);
        Optional<Friends> found = temp.stream()
                .filter(friend -> (friend.getFriendOne().equals(sender) && friend.getFriendTwo().equals(user)) || (friend.getFriendTwo().equals(sender) && friend.getFriendOne().equals(user)))
                .findFirst();

        try {
            if (found.isPresent()) {
                friendsRepository.delete(found.get());
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Connection wasn't found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error accepting friend request.");
        }
    }
}
