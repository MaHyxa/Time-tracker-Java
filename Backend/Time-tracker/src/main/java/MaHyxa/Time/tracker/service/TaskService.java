package MaHyxa.Time.tracker.service;

import MaHyxa.Time.tracker.model.Task;
import MaHyxa.Time.tracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {


    private final TaskRepository taskRepository;

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Optional<List<Task>> getAllTasksByUserId(Long id) {
        return Optional.empty();  //TODO  //TODO  //TODO
    }

    @Override
    public Task createTask(Long id, Task task) {
        task.setUser_id(id);
        return taskRepository.save(task);
    }

    @Override
    public Task startTime(Long id, Long start) throws ChangeSetPersister.NotFoundException {
        Optional<Task> thisTask = this.getTaskById(id);
        if(thisTask.isPresent())
        {
            Task updatedTask = thisTask.get();
            updatedTask.setStartTime(start);
            return taskRepository.save(updatedTask);
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public Task stopTime(Long id, Long stop) throws ChangeSetPersister.NotFoundException {
        Optional<Task> thisTask = this.getTaskById(id);
        if(thisTask.isPresent())
        {
            Task updatedTask = thisTask.get();
            updatedTask.setSpentTime(stop - updatedTask.getStartTime());
            return taskRepository.save(updatedTask);
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public Task complete(Long id, boolean complete) throws ChangeSetPersister.NotFoundException {
        Optional<Task> thisTask = this.getTaskById(id);
        if(thisTask.isPresent())
        {
            Task updatedTask = thisTask.get();
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
}
