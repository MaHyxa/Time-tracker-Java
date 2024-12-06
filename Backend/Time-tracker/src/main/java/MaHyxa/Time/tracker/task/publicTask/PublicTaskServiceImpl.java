package MaHyxa.Time.tracker.task.publicTask;

import MaHyxa.Time.tracker.cache.CacheService;
import MaHyxa.Time.tracker.config.KeycloakServiceImpl;
import MaHyxa.Time.tracker.friends.Friends;
import MaHyxa.Time.tracker.friends.FriendsRepository;
import MaHyxa.Time.tracker.friends.RelationshipStatus;
import MaHyxa.Time.tracker.notification.Notification;
import MaHyxa.Time.tracker.notification.NotificationService;
import MaHyxa.Time.tracker.notification.NotificationStatus;
import MaHyxa.Time.tracker.task.*;
import MaHyxa.Time.tracker.task.taskSession.TaskForPublicTaskDTO;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Primary
@RequiredArgsConstructor
public class PublicTaskServiceImpl implements PublicTaskService {
    private final PublicTaskRepository publicTaskRepository;
    private final TaskRepository taskRepository;
    private final FriendsRepository friendsRepository;
    private final KeycloakServiceImpl keycloakService;
    private final NotificationService notificationService;
    private final CacheService cacheService;


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


    @Override
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

    @Override
    public ResponseEntity<String> addPublicTask(JsonNode publicTask, Authentication connectedUser) {

        String owner = connectedUser.getName();
        String ownerEmail = keycloakService.getUserEmailById(owner);
        Set<String> assignedUsersList = new LinkedHashSet<>();
        JsonNode assignedUsers = publicTask.get("assignedUsers");

        if (assignedUsers.isArray()) {
            for (JsonNode userNode : assignedUsers) {
                assignedUsersList.add(userNode.asText());
            }
        } else return new ResponseEntity<>("Assigned users must be a list of an Emails", HttpStatus.BAD_REQUEST);

        List<String> responseList = new LinkedList<>();
        List<Task> taskList = new LinkedList<>();
        List<Friends> ownerFriends = friendsRepository.getAllFriendsByUser(owner);
        StringBuilder sb = new StringBuilder();

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
                cacheService.clearTaskListCache(findConnection.get().getRequestedBy());
                cacheService.clearTaskListCache(findConnection.get().getUser()
                );

                sb.setLength(0);
                sb.append("Task for user ");
                sb.append(assignedUser);
                sb.append(" was successfully added.");

                responseList.add(sb.toString());

                sb.setLength(0);
                sb.append("A new task has been assigned to you by ");
                sb.append(ownerEmail);


                notificationService.sendNotification(findConnection.get().getUser().equals(owner) ? findConnection.get().getRequestedBy() : findConnection.get().getUser(),
                        Notification.builder()
                        .status(NotificationStatus.TASK_ASSIGNED)
                        .taskName(task.getTaskName())
                        .message(sb.toString())
                        .build());
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

    @Override
    public ResponseEntity<String> deleteTask(Long requestBody, Authentication connectedUser) {

        PublicTask patchedTask = publicTaskRepository.findPublicTaskByUserIdAndId(connectedUser.getName(), requestBody);
        StringBuilder sb = new StringBuilder();
        String ownerEmail = keycloakService.getUserEmailById(connectedUser.getName());

        if(patchedTask == null) {
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }

        for (Task t : patchedTask.getAssignedTasks()) {

            cacheService.clearTaskListCache(t.getUserId());

            sb.setLength(0);
            sb.append(ownerEmail);
            sb.append(" has deleted the task assigned to you.");

            notificationService.sendNotification(t.getUserId(),
                    Notification.builder()
                            .status(NotificationStatus.TASK_DELETED)
                            .taskName(t.getTaskName())
                            .message(sb.toString())
                            .build());
        }

        cacheService.clearTaskListCache(connectedUser.getName());
        publicTaskRepository.delete(patchedTask);

        return ResponseEntity.noContent().build();
    }

}
