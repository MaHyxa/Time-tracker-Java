package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.taskSession.TaskSessionService;
import MaHyxa.Time.tracker.user.User;
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
