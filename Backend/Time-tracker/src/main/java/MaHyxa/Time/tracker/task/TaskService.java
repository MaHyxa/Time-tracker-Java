package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.taskSession.TaskSessionService;
import MaHyxa.Time.tracker.user.User;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.sql.Date;


@Service
@EnableScheduling
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    private final TaskSessionService taskSessionService;


    public List<Task> getAllTasksByUserId(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        var userTasks = taskRepository.findAllUserTasks(user.getId());
        if (userTasks.isEmpty())
            return Collections.emptyList();

        return new ArrayList<>(userTasks);
    }


    public void createTask(String taskName, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Task task = Task.builder()
                .taskName(taskName)
                .user(user)
                .createdAt(LocalDateTime.now())
                .taskSession(Collections.emptyList())
                .spentTime(0L)
                .build();
        taskRepository.save(task);
    }


    private Task updateTask(Long requestBody, Principal connectedUser, boolean setActive, boolean setComplete) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Task patchedTask = taskRepository.findTaskByUserIdAndId(user.getId(), requestBody);
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

    public Task startTime(Long requestBody, Principal connectedUser) {
        return updateTask(requestBody, connectedUser, true, false);
    }

    public Task stopTime(Long requestBody, Principal connectedUser) {
        return updateTask(requestBody, connectedUser, false, false);
    }

    public Task completeTask(Long requestBody, Principal connectedUser) {
        return updateTask(requestBody, connectedUser, false, true);
    }


    public void deleteTask(Long requestBody, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Task patchedTask = taskRepository.findTaskByUserIdAndId(user.getId(), requestBody);
        taskRepository.delete(patchedTask);
    }

    public List<TaskReportResponse> findTasksByDates(JsonNode dateRange, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        String startDate = dateRange.get("startDate").asText().substring(0, 10);
        String endDate = dateRange.get("endDate").asText().substring(0, 10);

        List<TaskReportResponse> selectedTasksForReport = new ArrayList<>();

        List<Task> selectedTasks = taskRepository.findTasksByDateRange(Date.valueOf(startDate), Date.valueOf(endDate), user.getId());

        for (Task t: selectedTasks) {
            TaskReportResponse trr = TaskReportResponse.builder()
                    .task(t)
                    .taskSessionList(taskSessionService.selectSessionsByDate(startDate, endDate, t.getId()))
                    .build();
            selectedTasksForReport.add(trr);
        }

        return selectedTasksForReport;
    }


    //Midnight Task reset
    @Scheduled(cron = "59 59 23 * * *")
    public void stopAllActiveTasks() {
        taskRepository.findAllByIsActiveTrue().forEach(task -> {
            taskRepository.deactivateActiveTasks(task.getId());
            taskSessionService.deleteSession(task);
        });
    }
}
