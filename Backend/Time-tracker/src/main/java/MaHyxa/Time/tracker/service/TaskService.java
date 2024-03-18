package MaHyxa.Time.tracker.service;

import MaHyxa.Time.tracker.model.Task;
import MaHyxa.Time.tracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@EnableScheduling
@RequiredArgsConstructor
public class TaskService implements ITaskService {


    private final TaskRepository taskRepository;

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Optional<List<Task>> getAllTasksByUserId(Long id) {
        return taskRepository.findAllUserTasks(id);
    }

    @Override
    public Optional<List<Long>> getAllActiveTasksIds() {
        return taskRepository.findActiveTasks();
    }

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
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

    @Override
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

    @Override
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

    @Override
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
            throw new RuntimeException("Please add at least 1 task to perform midnight task reset");
        }
    }
}
