package MaHyxa.Time.tracker.controller;

import MaHyxa.Time.tracker.model.Task;
import MaHyxa.Time.tracker.service.ITaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final ITaskService taskService;

    @PostMapping("/new")
    public ResponseEntity<Task> createTask(@Valid @RequestBody Long id, Task task) {
        Task newTask = taskService.createTask(id, task);
        return ResponseEntity.status(HttpStatus.CREATED).body(newTask);
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<Task>> getAllTasksByUserId(@Valid @RequestBody Long id) throws ChangeSetPersister.NotFoundException {
        Optional<List<Task>> tasks = taskService.getAllTasksByUserId(id);
        if(tasks.isPresent())
        {
            return ResponseEntity.ok(tasks.get());
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @GetMapping("my-tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Optional<Task> task = taskService.getTaskById(id);
        if(task.isPresent())
        {
            return ResponseEntity.ok(task.get());
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @PutMapping("my-tasks/{id}/start")
    public ResponseEntity<Task> startTask(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Task changetask = taskService.startTime(id, System.nanoTime());
        return ResponseEntity.ok(changetask);
    }

    @PutMapping("my-tasks/{id}/stop")
    public ResponseEntity<Task> stopTask(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Task changetask = taskService.stopTime(id, System.nanoTime());
        return ResponseEntity.ok(changetask);
    }

    @PutMapping("my-tasks/{id}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Task changetask = taskService.complete(id);
        return ResponseEntity.ok(changetask);
    }

    @DeleteMapping("my-tasks/{id}/delete")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

}
