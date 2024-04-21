package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.user.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
@EnableScheduling
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;


    public List<TaskResponse> getAllTasksByUserId(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        var userTasks = taskRepository.findAllUserTasks(user.getId());
        if (userTasks.isEmpty())
            return Collections.emptyList();
        List<TaskResponse> userTaskResponse = new ArrayList<>();

        userTasks.forEach(task -> {
            var taskResponse = TaskResponse.builder()
                    .id(task.getId())
                    .taskName(task.getTaskName())
                    .isComplete(task.isComplete())
                    .startTime(task.getStartTime())
                    .spentTime(task.getSpentTime())
                    .isActive(task.isActive())
                    .build();
            userTaskResponse.add(taskResponse);
        });
        return userTaskResponse;
    }


    public Optional<List<Long>> getAllActiveTasksIds() {
        return taskRepository.findActiveTasks();
    }


    public void createTask(String taskName, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var task = Task.builder()
                .taskName(taskName)
                .user(user)
                .createdAt(LocalDateTime.now())
                .startTime(0L)
                .spentTime(0L)
                .build();
        taskRepository.save(task);
    }


    private TaskResponse updateTask(JsonNode requestBody, Principal connectedUser, boolean setActive, boolean setComplete) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Task patchedTask = taskRepository.findTaskByUserIdAndId(user.getId(), requestBody.get("id").asLong());
        long currentTime = System.currentTimeMillis();
        if (!setComplete) {
            if (setActive) {
                //start
                patchedTask.setActive(true);
                patchedTask.setStartTime(currentTime);
            } else {
                //stop
                patchedTask.setActive(false);
                patchedTask.setSpentTime(patchedTask.getSpentTime() + currentTime - patchedTask.getStartTime());
            }
        }
        //complete
        if (setComplete && !setActive) {
            patchedTask.setComplete(true);
        }
        taskRepository.save(patchedTask);
        return TaskResponse.builder()
                .id(patchedTask.getId())
                .taskName(patchedTask.getTaskName())
                .isComplete(patchedTask.isComplete())
                .startTime(patchedTask.getStartTime())
                .spentTime(patchedTask.getSpentTime())
                .isActive(patchedTask.isActive())
                .build();
    }

    public TaskResponse startTime(JsonNode requestBody, Principal connectedUser) {
        return updateTask(requestBody, connectedUser, true, false);
    }

    public TaskResponse stopTime(JsonNode requestBody, Principal connectedUser) {
        return updateTask(requestBody, connectedUser, false, false);
    }

    public TaskResponse completeTask(JsonNode requestBody, Principal connectedUser) {
        return updateTask(requestBody, connectedUser, false, true);
    }


    public void deleteTask(JsonNode requestBody, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Task patchedTask = taskRepository.findTaskByUserIdAndId(user.getId(), requestBody.get("id").asLong());
        taskRepository.delete(patchedTask);
    }


    //Midnight Task reset
//    @Scheduled(cron = "59 59 23 * * *")
//    public void stopAllActiveTasks() throws ChangeSetPersister.NotFoundException {
//        try {
//            if(taskRepository.findActiveTasks().isPresent()) {
//                for (int i = 0; i < taskRepository.findActiveTasks().stream().count(); i++) {
//                    stopTime(taskRepository.findActiveTasks().get().get(i));
//            }
//            }
//        } catch (IndexOutOfBoundsException e) {
//            throw new RuntimeException("No Active Tasks found");
//        }
//    }
}
