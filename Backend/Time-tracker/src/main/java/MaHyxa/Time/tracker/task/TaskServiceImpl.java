package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.cache.CacheService;
import MaHyxa.Time.tracker.config.KeycloakService;
import MaHyxa.Time.tracker.notification.Notification;
import MaHyxa.Time.tracker.notification.NotificationService;
import MaHyxa.Time.tracker.notification.NotificationStatus;
import MaHyxa.Time.tracker.task.taskSession.TaskSessionService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
@Primary
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService{

    private final TaskSessionService taskSessionService;

    private final TaskRepository taskRepository;

    private final CacheService cacheService;

    private final NotificationService notificationService;

    private final KeycloakService keycloakService;


    private List<Task> getAllTasksForUser(String connectedUser) {
        List<Task> tasks = taskRepository.findAllUserTasks(connectedUser);
        log.debug("Fetching task list from database for user=[{}]", connectedUser);
        return tasks;
    }

    private PersonalTaskDTO taskDTO (Task t) {
        return PersonalTaskDTO.builder()
                .id(t.getId())
                .taskName(t.getTaskName())
                .createdAt(t.getCreatedAt())
                .completedAt(t.getCompletedAt())
                .taskType(t.getTaskType().ordinal())
                .taskStatus(t.getTaskStatus().ordinal())
                .spentTime(t.getSpentTime())
                .createdBy(t.getCreatedBy())
                .build();
    }

    /**
     *
     * @return List of Task DTO for API
     */

    @Override
    @Cacheable(value = "taskList", key = "'user=' + #connectedUser.name")
    public List<PersonalTaskDTO> getAllTasksDTOByUserId(Authentication connectedUser) {

        var userTasks = getAllTasksForUser(connectedUser.getName());

        List<PersonalTaskDTO> personalTaskDTOList = new LinkedList<>();

        for (Task t : userTasks) {
            if(t.getTaskStatus() != TaskStatus.REJECTED) {
                personalTaskDTOList.add(taskDTO(t));
            }
        }

        return personalTaskDTOList;
    }

    @Override
    public ResponseEntity<?> createTask(JsonNode taskName, Authentication connectedUser) {
        Task task = Task.builder()
                .taskName(taskName.get("description").asText())
                .userId(connectedUser.getName())
                .taskType(TaskType.PRIVATE)
                .build();
        taskRepository.save(task);
        cacheService.clearTaskListCache(connectedUser.getName());
        log.debug("Created task id=[{}] for user=[{}]", task.getId(), connectedUser.getName());
        return ResponseEntity.ok(taskDTO(task));
    }

    @Override
    public ResponseEntity<?> updateTask(Long requestBody, Authentication connectedUser, boolean setActive, boolean setComplete) {

        String user = connectedUser.getName();
        Task patchedTask = cacheService.cacheTask(requestBody, user);

        if(patchedTask == null) {
            log.warn("Task id=[{}] for user=[{}] wasn't found during updating", requestBody, user);
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }

        TaskStatus ts = patchedTask.getTaskStatus();

        if(ts == TaskStatus.COMPLETED) {
            return new ResponseEntity<>("Task is already complete. It can't be changed.", HttpStatus.LOCKED);
        }

        if (!setComplete) {
            if(ts == TaskStatus.REJECTED || ts == TaskStatus.PENDING) {
                return new ResponseEntity<>("You need to accept Task first.", HttpStatus.UPGRADE_REQUIRED);
            }
            else {
                if (setActive) {
                    //start
                    if(ts == TaskStatus.ACTIVE) {
                        return new ResponseEntity<>("Task has already started", HttpStatus.UPGRADE_REQUIRED);
                    }
                    else {
                        patchedTask.setTaskStatus(TaskStatus.ACTIVE);
                        patchedTask.setActiveTaskSessionId(taskSessionService.startSession(patchedTask));
                    }
                }
                else {
                    //stop
                    if(ts == TaskStatus.ACTIVE) {
                        patchedTask.setTaskStatus(TaskStatus.NOT_ACTIVE);
                        patchedTask.setSpentTime(patchedTask.getSpentTime() + taskSessionService.stopSession(patchedTask.getActiveTaskSessionId(), patchedTask.getId()));
                        patchedTask.setActiveTaskSessionId(null);
                    }
                    else {
                        return new ResponseEntity<>("Task is not active", HttpStatus.UPGRADE_REQUIRED);
                    }
                }
            }
        }

        //complete
        if (setComplete && !setActive) {
            if(ts == TaskStatus.ACTIVE || ts == TaskStatus.REJECTED || ts == TaskStatus.PENDING) {
                return new ResponseEntity<>("You need to stop working with this Task first.", HttpStatus.UPGRADE_REQUIRED);
            }
            else {
                patchedTask.setTaskStatus(TaskStatus.COMPLETED);
                patchedTask.setCompletedAt(LocalDateTime.now());
                if(patchedTask.getCreatedBy() != null) {
                    notificationService.sendNotification(patchedTask.getCreatedBy(),
                            Notification.builder()
                                    .status(NotificationStatus.TASK_COMPLETED)
                                    .taskName(patchedTask.getTaskName())
                                    .message(patchedTask.getUserEmail()+" completed assigned task.")
                                    .build());
                }
            }
        }

        cacheService.cacheUpdatedTask(patchedTask, user);
        cacheService.clearTaskListCache(user);

        return ResponseEntity.ok(taskDTO(patchedTask));
    }

    @Override
    public ResponseEntity<?> startTime(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, true, false);
    }

    @Override
    public ResponseEntity<?> stopTime(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, false, false);
    }

    @Override
    public ResponseEntity<?> completeTask(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, false, true);
    }


    @Override
    public ResponseEntity<?> deleteTask(Long requestBody, Authentication connectedUser) {

        String user = connectedUser.getName();
        Task patchedTask = cacheService.cacheTask(requestBody, user);

        if(patchedTask == null) {
            log.warn("Task id=[{}] for user=[{}] wasn't found during deleting", requestBody, user);
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }

        if(patchedTask.getTaskType() == TaskType.PRIVATE) {
            taskRepository.delete(patchedTask);
            cacheService.deleteCachedTask(patchedTask.getId(), user);
            cacheService.clearTaskListCache(user);
            log.info("Task id=[{}] for user=[{}] deleted", requestBody, user);
            return ResponseEntity.noContent().build();
        }
        else {
            return new ResponseEntity<>("You can delete only personal Task.", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<?> acceptTask(Long requestBody, Authentication connectedUser) {

        String user = connectedUser.getName();
        Task patchedTask = cacheService.cacheTask(requestBody, user);

        if(patchedTask == null) {
            log.warn("Task id=[{}] for user=[{}] wasn't found during accepting assigned task", requestBody, user);
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }


        if(patchedTask.getTaskType() != TaskType.PRIVATE) {
            patchedTask.setTaskStatus(TaskStatus.ACCEPTED);
            cacheService.cacheUpdatedTask(patchedTask, user);
            cacheService.clearTaskListCache(user);
            if(patchedTask.getCreatedBy() != null) {
                String ownerId = keycloakService.getUserIdByEmail(patchedTask.getCreatedBy());
                if(ownerId != null) {
                    cacheService.clearTaskListCache(ownerId);
                    notificationService.sendNotification(ownerId,
                            Notification.builder()
                                    .status(NotificationStatus.TASK_ACCEPTED)
                                    .taskName(patchedTask.getTaskName())
                                    .message(patchedTask.getUserEmail() + " accepted assigned task.")
                                    .build());
                }
            }
            return ResponseEntity.ok(taskDTO(patchedTask));
        }
        else {
            return new ResponseEntity<>("You can't accept personal Task.", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<?> rejectTask(Long requestBody, Authentication connectedUser) {

        String user = connectedUser.getName();
        Task patchedTask = cacheService.cacheTask(requestBody, user);

        if(patchedTask == null) {
            log.warn("Task id=[{}] for user=[{}] wasn't found during rejecting assigned task", requestBody, user);
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }

        if(patchedTask.getTaskType() != TaskType.PRIVATE) {
            patchedTask.setTaskStatus(TaskStatus.REJECTED);
            cacheService.cacheUpdatedTask(patchedTask, user);
            cacheService.clearTaskListCache(user);
            if(patchedTask.getCreatedBy() != null) {
                String ownerId = keycloakService.getUserIdByEmail(patchedTask.getCreatedBy());
                if(ownerId != null) {
                    cacheService.clearTaskListCache(ownerId);
                    notificationService.sendNotification(ownerId,
                            Notification.builder()
                                    .status(NotificationStatus.TASK_REJECTED)
                                    .taskName(patchedTask.getTaskName())
                                    .message(patchedTask.getUserEmail()+" rejected assigned task.")
                                    .build());
                }
            }
            return ResponseEntity.noContent().build();
        }
        else {
            return new ResponseEntity<>("You can't reject personal Task.", HttpStatus.BAD_REQUEST);
        }
    }


//    Midnight Task reset if needed
//    @Scheduled(cron = "59 59 23 * * *")
//    public void stopAllActiveTasks() {
//        taskRepository.findAllByTaskStatus(TaskStatus.ACTIVE.ordinal()).forEach(task -> {
//            taskRepository.deactivateActiveTasks(task.getId());
//            taskSessionService.deleteSession(task.getId(), task.getActiveTaskSessionId());
//        });
//    }
}
