package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.auth.AuthenticationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/new")
    public ResponseEntity<?> createTask(@RequestBody String taskName, Principal connectedUser) {
        taskService.createTask(taskName, connectedUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskResponse>> getAllTasksByUserId(Principal connectedUser) {
        return ResponseEntity.ok(taskService.getAllTasksByUserId(connectedUser));
    }

    @GetMapping("my-tasks/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@RequestBody TaskResponse request, Principal connectedUser) throws ChangeSetPersister.NotFoundException {
        taskService.getTaskById(request.getId());
        return null;
//        if(task.isPresent())
//        {
//            return ResponseEntity.ok().build();
//        }
//        else {
//            throw new ChangeSetPersister.NotFoundException();
//        }
    }

    @PutMapping("my-tasks/{id}/start")
    public ResponseEntity<Task> startTask(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Task changetask = taskService.startTime(id);
        return ResponseEntity.ok(changetask);
    }

    @PutMapping("my-tasks/{id}/stop")
    public ResponseEntity<Task> stopTask(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Task changetask = taskService.stopTime(id);
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
