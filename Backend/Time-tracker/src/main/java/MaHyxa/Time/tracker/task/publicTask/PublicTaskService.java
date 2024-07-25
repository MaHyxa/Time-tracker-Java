package MaHyxa.Time.tracker.task.publicTask;

import MaHyxa.Time.tracker.config.databases.keycloak.UserRepositoryCustom;
import MaHyxa.Time.tracker.task.Task;
import MaHyxa.Time.tracker.task.TaskRepository;
import MaHyxa.Time.tracker.task.TaskType;
import MaHyxa.Time.tracker.task.taskSession.TaskForPublicTaskDTO;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class PublicTaskService {
    private final PublicTaskRepository publicTaskRepository;
    private final UserRepositoryCustom userRepositoryCustom;
    private final TaskRepository taskRepository;


    private List<TaskForPublicTaskDTO> getTasksForPublicTask(PublicTask publicTask) {

        List<TaskForPublicTaskDTO> taskList = new ArrayList<>();
        for (Task t : publicTask.getAssignedTasks()) {
            TaskForPublicTaskDTO tpt = TaskForPublicTaskDTO.builder()
                    .userEmail(t.getUserEmail())
                    .completedAt(t.getCompletedAt())
                    .isComplete(t.isComplete())
                    .answer(t.getAnswer())
                    .build();
            taskList.add(tpt);
        }
        return taskList;
    }


    public List<PublicTaskDTO> getAllPublicTasksByUser(Authentication connectedUser) {

        var userPublicTasks = publicTaskRepository.getAllPublicTasksByUser(connectedUser.getName());
        if (userPublicTasks.isEmpty())
            return Collections.emptyList();

        List<PublicTaskDTO> publicTasksList = new ArrayList<>();
        for (PublicTask pt : userPublicTasks) {
            PublicTaskDTO ptDTO = PublicTaskDTO.builder()
                    .taskName(pt.getTaskName())
                    .isComplete(pt.isComplete())
                    .createdAt(pt.getCreatedAt())
                    .assignedTasks(getTasksForPublicTask(pt))
                    .build();
            publicTasksList.add(ptDTO);
        }
        return publicTasksList;
    }

    public ResponseEntity<String> addPublicTask(JsonNode publicTask, Authentication connectedUser) {
        String owner = userRepositoryCustom.getUserEmailById(connectedUser.getName());
        List<String> assignedUsersList = new ArrayList<>();
        JsonNode assignedUsers = publicTask.get("assignedUsers");
        if (assignedUsers.isArray()) {
            for (JsonNode userNode : assignedUsers) {
                assignedUsersList.add(userNode.asText());
            }
        } else return new ResponseEntity<>("Assigned users must be a list of an Emails", HttpStatus.BAD_REQUEST);

        List<String> responseList = new ArrayList<>();
        List<Task> taskList = new ArrayList<>();
        for (String assignedUser : assignedUsersList) {
            String foundUser = userRepositoryCustom.getUserIdByEmail(assignedUser);
            if (foundUser != null) {
                Task task = Task.builder()
                        .taskName(publicTask.get("taskName").asText())
                        .userId(foundUser)
                        .createdAt(LocalDateTime.now())
                        .taskSession(Collections.emptyList())
                        .spentTime(0L)
                        .userEmail(assignedUser)
                        .createdBy(owner)
                        .taskType(TaskType.ASSIGNED)
                        .build();
                taskRepository.save(task);
                responseList.add("Task for user " + assignedUser + " was successfully added.");
                taskList.add(task);
            } else {
                responseList.add("User " + assignedUser + " was not found or is not your friend. Please try again.");
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
            return new ResponseEntity<>("Public task wasn't created due to lack of participants.", HttpStatus.NOT_FOUND);
        }
    }
}
