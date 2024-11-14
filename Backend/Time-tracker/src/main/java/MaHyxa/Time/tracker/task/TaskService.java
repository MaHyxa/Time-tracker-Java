package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.taskSession.TaskSessionService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.*;


@Service
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskSessionService taskSessionService;

    private final TaskRepository taskRepository;

    private final CacheService cacheService;


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

    @Cacheable(value = "taskList", key = "'user=' + #connectedUser")
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
            }
        }

        cacheService.cacheUpdatedTask(patchedTask, user);
        cacheService.clearTaskListCache(user);

        return ResponseEntity.ok(taskDTO(patchedTask));
    }

    public ResponseEntity<?> startTime(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, true, false);
    }

    public ResponseEntity<?> stopTime(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, false, false);
    }

    public ResponseEntity<?> completeTask(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, false, true);
    }


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
            return ResponseEntity.ok(taskDTO(patchedTask));
        }
        else {
            return new ResponseEntity<>("You can't accept personal Task.", HttpStatus.BAD_REQUEST);
        }
    }

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
            return ResponseEntity.noContent().build();
        }
        else {
            return new ResponseEntity<>("You can't reject personal Task.", HttpStatus.BAD_REQUEST);
        }
    }

    public List<TaskReportResponse> findTasksByDates(JsonNode dateRange, Authentication connectedUser) {

        String startDate = dateRange.get("startDate").asText().substring(0, 10);
        String endDate = dateRange.get("endDate").asText().substring(0, 10);

        List<TaskReportResponse> selectedTasksForReport = new ArrayList<>();

        List<Task> selectedTasks = taskRepository.findTasksByDateRange(Date.valueOf(startDate), Date.valueOf(endDate), connectedUser.getName());

        for (Task t: selectedTasks) {
            TaskReportResponse trr = TaskReportResponse.builder()
                    .task(t)
                    .taskSessionList(taskSessionService.selectSessionsByDate(startDate, endDate, t.getId()))
                    .build();
            selectedTasksForReport.add(trr);
        }

        return selectedTasksForReport;
    }

    public StatisticResponse getStatistic(Authentication connectedUser) {
        return cacheService.getStatistic(connectedUser.getName());
    }

    public StatisticResponse updateStatistic(Authentication connectedUser) {
        cacheService.clearUserStatsCache(connectedUser.getName());
        return cacheService.getStatistic(connectedUser.getName());
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
