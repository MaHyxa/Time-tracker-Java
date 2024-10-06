package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.config.KeycloakService;
import MaHyxa.Time.tracker.task.taskSession.TaskSessionService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.sql.Date;


@Service
@EnableScheduling
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    private final TaskSessionService taskSessionService;

    private final KeycloakService keycloakService;


    private PersonalTaskDTO taskDTO (Task t) {
        return PersonalTaskDTO.builder()
                .id(t.getId())
                .taskName(t.getTaskName())
                .createdAt(t.getCreatedAt())
                .completedAt(t.getCompletedAt())
                .taskType(t.getTaskType().ordinal())
                .taskStatus(t.getTaskStatus().ordinal())
                .spentTime(t.getSpentTime())
                .createdBy(t.getTaskType() == TaskType.PRIVATE ? null : keycloakService.getUserEmailById(t.getCreatedBy()))
                .build();
    }


    public List<PersonalTaskDTO> getAllTasksByUserId(Authentication connectedUser) {

        var userTasks = taskRepository.findAllUserTasks(connectedUser.getName());
        if (userTasks.isEmpty())
            return Collections.emptyList();

        List<PersonalTaskDTO> personalTaskDTO = new LinkedList<>();

        for (Task t : userTasks) {
            if(t.getTaskStatus() != TaskStatus.REJECTED) {
                personalTaskDTO.add(taskDTO(t));
            }
        }

        return personalTaskDTO;
    }


    public void createTask(JsonNode taskName, Authentication connectedUser) {
        Task task = Task.builder()
                .taskName(taskName.get("description").asText())
                .userId(connectedUser.getName())
                .taskType(TaskType.PRIVATE)
                .build();
        taskRepository.save(task);
    }


    private ResponseEntity<?> updateTask(Long requestBody, Authentication connectedUser, boolean setActive, boolean setComplete) {

        Task patchedTask = taskRepository.findTaskByUserIdAndId(connectedUser.getName(), requestBody);

        if(patchedTask == null) {
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
                        taskSessionService.startSession(patchedTask);
                    }
                }
                else {
                    //stop
                    if(ts == TaskStatus.ACTIVE) {
                        patchedTask.setTaskStatus(TaskStatus.NOT_ACTIVE);
                        patchedTask.setSpentTime(patchedTask.getSpentTime() + taskSessionService.stopSession(patchedTask));
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

        taskRepository.save(patchedTask);

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

        Task patchedTask = taskRepository.findTaskByUserIdAndId(connectedUser.getName(), requestBody);

        if(patchedTask == null) {
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }

        if(patchedTask.getTaskType() == TaskType.PRIVATE) {
            taskRepository.delete(patchedTask);
            return ResponseEntity.noContent().build();
        }
        else {
            return new ResponseEntity<>("You can delete only personal Task.", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<?> acceptTask(Long requestBody, Authentication connectedUser) {

        Task patchedTask = taskRepository.findTaskByUserIdAndId(connectedUser.getName(), requestBody);

        if(patchedTask == null) {
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }


        if(patchedTask.getTaskType() != TaskType.PRIVATE) {
            patchedTask.setTaskStatus(TaskStatus.ACCEPTED);
            taskRepository.save(patchedTask);
            return ResponseEntity.ok(taskDTO(patchedTask));
        }
        else {
            return new ResponseEntity<>("You can't accept personal Task.", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<?> rejectTask(Long requestBody, Authentication connectedUser) {

        Task patchedTask = taskRepository.findTaskByUserIdAndId(connectedUser.getName(), requestBody);

        if(patchedTask == null) {
            return new ResponseEntity<>("Task wasn't found. Please try again or refresh the page.", HttpStatus.NOT_FOUND);
        }

        if(patchedTask.getTaskType() != TaskType.PRIVATE) {
            patchedTask.setTaskStatus(TaskStatus.REJECTED);
            taskRepository.save(patchedTask);
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

        return StatisticResponse.builder()
                .totalUserTasks(taskRepository.findAllTasksByUser(connectedUser.getName()))
                .activeUserTasks(taskRepository.findAllActiveTasksByUser(connectedUser.getName()))
                .completeUserTasks(taskRepository.findAllCompleteTasksByUser(connectedUser.getName()))
                .longestTask(taskRepository.findLongestTaskByUser(connectedUser.getName()))
                .totalTimeSpent(taskRepository.findTasksTotalSpentTimeByUser(connectedUser.getName()))
                .build();
    }


//    Midnight Task reset if needed
//    @Scheduled(cron = "59 59 23 * * *")
//    public void stopAllActiveTasks() {
//        taskRepository.findAllByTaskStatus(TaskStatus.ACTIVE.ordinal()).forEach(task -> {
//            taskRepository.deactivateActiveTasks(task.getId());
//            taskSessionService.deleteSession(task);
//        });
//    }
}
