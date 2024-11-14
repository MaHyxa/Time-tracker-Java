package MaHyxa.Time.tracker.task.publicTask;

import MaHyxa.Time.tracker.config.KeycloakService;
import MaHyxa.Time.tracker.friends.Friends;
import MaHyxa.Time.tracker.friends.FriendsRepository;
import MaHyxa.Time.tracker.friends.RelationshipStatus;
import MaHyxa.Time.tracker.task.Task;
import MaHyxa.Time.tracker.task.TaskRepository;
import MaHyxa.Time.tracker.task.TaskStatus;
import MaHyxa.Time.tracker.task.TaskType;
import MaHyxa.Time.tracker.task.taskSession.TaskForPublicTaskDTO;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class PublicTaskService {
    private final PublicTaskRepository publicTaskRepository;
    private final TaskRepository taskRepository;
    private final FriendsRepository friendsRepository;
    private final KeycloakService keycloakService;


    private List<TaskForPublicTaskDTO> getTasksForPublicTask(PublicTask publicTask) {

        List<TaskForPublicTaskDTO> taskList = new LinkedList<>();
        for (Task t : publicTask.getAssignedTasks()) {
            TaskForPublicTaskDTO tpt = TaskForPublicTaskDTO.builder()
                    .userEmail(t.getUserEmail())
                    .completedAt(t.getCompletedAt())
                    .taskStatus(t.getTaskStatus().ordinal())
                    .answer(t.getAnswer())
                    .build();
            taskList.add(tpt);
        }
        return taskList;
    }


    public Page<PublicTaskDTO> getAllPublicTasksByUser(Authentication connectedUser, Pageable pageable) {

        var userPublicTasks = publicTaskRepository.getAllPublicTasksByUser(connectedUser.getName(), pageable);
        if (userPublicTasks.isEmpty())
            return Page.empty(pageable);

        return userPublicTasks.map(pt -> PublicTaskDTO.builder()
                .id(pt.getId())
                .taskName(pt.getTaskName())
                .isComplete(pt.isComplete())
                .createdAt(pt.getCreatedAt())
                .assignedTasks(getTasksForPublicTask(pt))
                .build());
    }

    public ResponseEntity<String> addPublicTask(JsonNode publicTask, Authentication connectedUser) {

        String owner = connectedUser.getName();
        String ownerEmail = keycloakService.getUserEmailById(owner);
        List<String> assignedUsersList = new LinkedList<>();
        JsonNode assignedUsers = publicTask.get("assignedUsers");

        if (assignedUsers.isArray()) {
            for (JsonNode userNode : assignedUsers) {
                assignedUsersList.add(userNode.asText());
            }
        } else return new ResponseEntity<>("Assigned users must be a list of an Emails", HttpStatus.BAD_REQUEST);

        List<String> responseList = new LinkedList<>();
        List<Task> taskList = new LinkedList<>();
        List<Friends> ownerFriends = friendsRepository.getAllFriendsByUser(owner);

        for (String assignedUser : assignedUsersList) {

            String assignerUserId = keycloakService.getUserIdByEmail(assignedUser);

            Optional<Friends> findConnection = ownerFriends.stream()
                    .filter(friend -> (friend.getUser().equals(owner) && friend.getRequestedBy().equals(assignerUserId))
                            || (friend.getUser().equals(assignerUserId) && friend.getRequestedBy().equals(owner)))
                    .findFirst();

            if (findConnection.isPresent() && findConnection.get().getStatus() == RelationshipStatus.ACCEPTED) {
                Task task = Task.builder()
                        .taskName(publicTask.get("taskName").asText())
                        .userId(findConnection.get().getUser().equals(owner) ? findConnection.get().getRequestedBy() : findConnection.get().getUser())
                        .userEmail(assignedUser)
                        .createdBy(ownerEmail)
                        .taskType(TaskType.ASSIGNED)
                        .taskStatus(TaskStatus.PENDING)
                        .build();
                taskRepository.save(task);
                responseList.add("Task for user " + assignedUser + " was successfully added.");
                taskList.add(task);
            } else {
                responseList.add("Task for user " + assignedUser + " was not created, because user was not found or is not your friend yet. Please try again.");
            }
        }
        String response = String.join("\n", responseList);

        if (!taskList.isEmpty()) {
            PublicTask pt = PublicTask.builder()
                    .taskName(publicTask.get("taskName").asText())
                    .userId(connectedUser.getName())
                    .createdAt(LocalDateTime.now())
                    .assignedTasks(taskList)
                    .build();
            publicTaskRepository.save(pt);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Public task wasn't created due to lack of participants. You can assign tasks for already connected users only.", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<String> deleteTask(Long requestBody, Authentication connectedUser) {

        PublicTask patchedTask = publicTaskRepository.findPublicTaskByUserIdAndId(connectedUser.getName(), requestBody);

        if(patchedTask == null) {
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }

        publicTaskRepository.delete(patchedTask);

        return ResponseEntity.noContent().build();
    }

}
