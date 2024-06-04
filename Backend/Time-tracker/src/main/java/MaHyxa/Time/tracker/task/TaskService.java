package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.taskSession.TaskSessionService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
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


    public StatisticResponse getStatistic(Authentication connectedUser) {

        return StatisticResponse.builder()
                .totalUserTasks(taskRepository.findAllTasksByUser(connectedUser.getName()))
                .activeUserTasks(taskRepository.findAllActiveTasksByUser(connectedUser.getName()))
                .completeUserTasks(taskRepository.findAllCompleteTasksByUser(connectedUser.getName()))
                .longestTask(taskRepository.findLongestTaskByUser(connectedUser.getName()))
                .totalTimeSpent(taskRepository.findTasksTotalSpentTimeByUser(connectedUser.getName()))
                .build();
    }

    public List<Task> getAllTasksByUserId(Authentication connectedUser) {

        var userTasks = taskRepository.findAllUserTasks(connectedUser.getName());
        if (userTasks.isEmpty())
            return Collections.emptyList();

        return new ArrayList<>(userTasks);
    }


    public void createTask(JsonNode taskName, Authentication connectedUser) {
        Task task = Task.builder()
                .taskName(taskName.get("description").asText())
                .userId(connectedUser.getName())
                .createdAt(LocalDateTime.now())
                .taskSession(Collections.emptyList())
                .spentTime(0L)
                .build();
        taskRepository.save(task);
    }


    private Task updateTask(Long requestBody, Authentication connectedUser, boolean setActive, boolean setComplete) {

        Task patchedTask = taskRepository.findTaskByUserIdAndId(connectedUser.getName(), requestBody);
        if(patchedTask.isComplete())
            return patchedTask;

        if (!setComplete) {
            if (setActive) {
                //start
                patchedTask.setActive(true);
                taskSessionService.startSession(patchedTask);
            } else {
                //stop
                patchedTask.setActive(false);
                patchedTask.setSpentTime(patchedTask.getSpentTime() + taskSessionService.stopSession(patchedTask));
            }
        }
        //complete
        if (setComplete && !setActive) {
            patchedTask.setComplete(true);
            patchedTask.setCompletedAt(LocalDateTime.now());
        }
        taskRepository.save(patchedTask);
        return patchedTask;
    }

    public Task startTime(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, true, false);
    }

    public Task stopTime(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, false, false);
    }

    public Task completeTask(Long requestBody, Authentication connectedUser) {
        return updateTask(requestBody, connectedUser, false, true);
    }


    public void deleteTask(Long requestBody, Authentication connectedUser) {

        Task patchedTask = taskRepository.findTaskByUserIdAndId(connectedUser.getName(), requestBody);
        taskRepository.delete(patchedTask);
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


    //Midnight Task reset if needed
//    @Scheduled(cron = "59 59 23 * * *")
//    public void stopAllActiveTasks() {
//        taskRepository.findAllByIsActiveTrue().forEach(task -> {
//            taskRepository.deactivateActiveTasks(task.getId());
//            taskSessionService.deleteSession(task);
//        });
//    }
}
