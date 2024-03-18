package MaHyxa.Time.tracker.service;

import MaHyxa.Time.tracker.model.Task;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;
import java.util.Optional;

public interface ITaskService {

    Optional<Task> getTaskById(Long id);

    Optional<List<Task>> getAllTasksByUserId (Long id);

    Optional<List<Long>> getAllActiveTasksIds();

    Task createTask (Task task);

    Task startTime (Long id) throws ChangeSetPersister.NotFoundException;

    Task stopTime (Long id) throws ChangeSetPersister.NotFoundException;

    Task complete (Long id) throws ChangeSetPersister.NotFoundException;

    void deleteTask (Long id);

}
