package MaHyxa.Time.tracker.friends;

import MaHyxa.Time.tracker.config.KeycloakService;
import MaHyxa.Time.tracker.notification.Notification;
import MaHyxa.Time.tracker.notification.NotificationService;
import MaHyxa.Time.tracker.notification.NotificationStatus;
import MaHyxa.Time.tracker.task.CacheService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendsService {

    private final FriendsRepository friendsRepository;
    private final KeycloakService keycloakService;
    private final CacheService cacheService;
    private final NotificationService notificationService;

    private RelationshipStatus isFriends(String user, String requestedBy) {
        return friendsRepository.checkFriends(user, requestedBy);
    }

    public ResponseEntity<String> addFriend(JsonNode email, Authentication connectedUser) {
        String requestedBy = connectedUser.getName();
        String user = keycloakService.getUserIdByEmail(email.get("email").asText());

        if (requestedBy != null && user != null) {
            if (user.equals(requestedBy)) {
                return new ResponseEntity<>("You can't connect to yourself", HttpStatus.BAD_REQUEST);
            }

            if (isFriends(user, requestedBy) == RelationshipStatus.ACCEPTED) {
                return new ResponseEntity<>("You are already connected with this user.", HttpStatus.CONFLICT);
            }

            if (isFriends(user, requestedBy) == RelationshipStatus.PENDING) {
                return new ResponseEntity<>("You've already sent request to this user. Please wait for acceptance.", HttpStatus.CONFLICT);
            } else {
                Friends friend = Friends.builder()
                        .user(user)
                        .requestedBy(requestedBy)
                        .status(RelationshipStatus.PENDING)
                        .build();
                friendsRepository.save(friend);
                cacheService.clearFriendListCache(requestedBy);
                cacheService.clearFriendListCache(user);

                notificationService.sendNotification(user,
                        Notification.builder()
                                .status(NotificationStatus.REQUEST_CONN)
                                .taskName("Connection request")
                                .message(keycloakService.getUserEmailById(requestedBy)+" requested for a connection with you.")
                                .build());

                return new ResponseEntity<>("Request successfully sent.", HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>("User wasn't found in our service.", HttpStatus.NOT_FOUND);
        }
    }


    @Cacheable(value = "friendList", key = "'user=' + #connectedUser.name")
    public List<FriendsDTO> getAllUserFriends(Authentication connectedUser) {
        String user = connectedUser.getName();
        List<Friends> temp = friendsRepository.getAllFriendsByUser(user);

        List<FriendsDTO> friendNames = temp.stream()
                .map(friend -> FriendsDTO.builder()
                        .friend(friend.getUser().equals(user) ? keycloakService.getUserEmailById(friend.getRequestedBy()) : keycloakService.getUserEmailById(friend.getUser()))
                        .status(friend.getStatus().equals(RelationshipStatus.PENDING) ?
                                (friend.getRequestedBy().equals(user) ? RelationshipStatus.PENDING.ordinal() : RelationshipStatus.REQUESTED.ordinal()) :
                                friend.getStatus().ordinal())
                        .build())
                .collect(Collectors.toList());
        return friendNames;
    }


    public ResponseEntity<?> acceptConnect(JsonNode requestBody, Authentication connectedUser) {
        String user = connectedUser.getName();
        String friendEmail = requestBody.asText();
        String requestedBy = keycloakService.getUserIdByEmail(friendEmail);
        List<Friends> temp = friendsRepository.getAllFriendsByUser(user);
        Optional<Friends> found = temp.stream()
                .filter(friend -> friend.getUser().equals(user) && friend.getRequestedBy().equals(requestedBy) && friend.getStatus().equals(RelationshipStatus.PENDING))
                .findFirst();

        try {
            if (found.isPresent()) {
                Friends foundFriend = found.get();
                foundFriend.setStatus(RelationshipStatus.ACCEPTED);
                friendsRepository.save(foundFriend);
                FriendsDTO friendsDTO = FriendsDTO.builder()
                        .friend(friendEmail)
                        .status(foundFriend.getStatus().ordinal())
                        .build();
                cacheService.clearFriendListCache(requestedBy);
                cacheService.clearFriendListCache(user);

                notificationService.sendNotification(requestedBy,
                        Notification.builder()
                                .status(NotificationStatus.ACCEPT_CONN)
                                .taskName("Connection accepted")
                                .message(keycloakService.getUserEmailById(user)+" accepted your request for a connection.")
                                .build());

                return ResponseEntity.ok().body(friendsDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Connection request wasn't found or connection already established");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error accepting friend request.");
        }
    }

    public ResponseEntity<?> rejectConnect(JsonNode requestBody, Authentication connectedUser) {
        String user = connectedUser.getName();
        String requestedBy = keycloakService.getUserIdByEmail(requestBody.asText());
        List<Friends> temp = friendsRepository.getAllFriendsByUser(user);
        Optional<Friends> found = temp.stream()
                .filter(friend -> (friend.getUser().equals(user) && friend.getRequestedBy().equals(requestedBy)) || (friend.getUser().equals(requestedBy) && friend.getRequestedBy().equals(user)))
                .findFirst();

        try {
            if (found.isPresent()) {
                friendsRepository.delete(found.get());
                cacheService.clearFriendListCache(requestedBy);
                cacheService.clearFriendListCache(user);

                if(found.get().getRequestedBy().equals(user)) {
                    notificationService.sendNotification(user,
                            Notification.builder()
                                    .status(NotificationStatus.REJECT_CONN)
                                    .taskName("Connection removed")
                                    .message("Connection with "+found.get().getUser()+" removed.")
                                    .build());
                }
                else {
                    notificationService.sendNotification(requestedBy,
                            Notification.builder()
                                    .status(NotificationStatus.REJECT_CONN)
                                    .taskName("Connection rejected")
                                    .message(keycloakService.getUserEmailById(user)+" revoked your request for a connection.")
                                    .build());
                }


                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Connection wasn't found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error accepting friend request.");
        }
    }
}
