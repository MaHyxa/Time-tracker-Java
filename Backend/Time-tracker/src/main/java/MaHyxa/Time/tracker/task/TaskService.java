package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@EnableScheduling
@RequiredArgsConstructor
public class TaskService {


    private final TaskRepository taskRepository;


    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }


    public List<TaskResponse> getAllTasksByUserId(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        var userTasks = taskRepository.findAllUserTasks(user.getId());
        if (userTasks.isEmpty())
            return null;
        List<TaskResponse> userTaskResponse = new ArrayList<>();

        userTasks.forEach(task -> {
            var taskResponse = TaskResponse.builder()
                    .id(task.getId())
                    .taskName(task.getTaskName())
                    .complete(task.isComplete())
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
                .startTime(0L)
                .spentTime(0L)
                .build();
        taskRepository.save(task);
    }


    public Task startTime(Long id) throws ChangeSetPersister.NotFoundException {
        Optional<Task> thisTask = this.getTaskById(id);
        if(thisTask.isPresent())
        {
            Task updatedTask = thisTask.get();
            updatedTask.setStartTime(System.nanoTime());
            updatedTask.setActive(true);
            return taskRepository.save(updatedTask);
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public Task stopTime(Long id) throws ChangeSetPersister.NotFoundException {
        Optional<Task> thisTask = this.getTaskById(id);
        if(thisTask.isPresent())
        {
            Task updatedTask = thisTask.get();
            updatedTask.setSpentTime(updatedTask.getSpentTime() + System.nanoTime() - updatedTask.getStartTime());
            updatedTask.setActive(false);
            return taskRepository.save(updatedTask);
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }


    public Task complete(Long id) throws ChangeSetPersister.NotFoundException {
        Optional<Task> thisTask = this.getTaskById(id);
        if(thisTask.isPresent())
        {
            Task updatedTask = thisTask.get();
            if (updatedTask.isActive()) {
                updatedTask.setSpentTime(updatedTask.getSpentTime() + System.nanoTime() - updatedTask.getStartTime());
                updatedTask.setActive(false);
            }
            updatedTask.setComplete(true);
            return taskRepository.save(updatedTask);
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }


    //Midnight Task reset
    @Scheduled(cron = "59 59 23 * * *")
    public void stopAllActiveTasks() throws ChangeSetPersister.NotFoundException {
        try {
            if(taskRepository.findActiveTasks().isPresent()) {
                for (int i = 0; i < taskRepository.findActiveTasks().stream().count(); i++) {
                    stopTime(taskRepository.findActiveTasks().get().get(i));
            }
            }
        } catch (IndexOutOfBoundsException e) {
            throw new RuntimeException("No Active Tasks found");
        }
    }
}
