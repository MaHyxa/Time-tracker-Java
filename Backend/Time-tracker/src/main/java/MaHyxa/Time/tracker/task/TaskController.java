package MaHyxa.Time.tracker.task;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private long spamPrevent = 0;



    @GetMapping("/userStatistics")
    public ResponseEntity<StatisticResponse> getStatistic(Authentication connectedUser) {
        return ResponseEntity.ok(taskService.getStatistic(connectedUser));
    }

    @PostMapping("/new")
    public ResponseEntity<?> createTask(@RequestBody JsonNode taskName, Authentication connectedUser) {
        if(Instant.now().getEpochSecond() > spamPrevent)
        {
            taskService.createTask(taskName, connectedUser);
            //3 seconds delay between requests
            spamPrevent = Instant.now().getEpochSecond() + 3;
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.badRequest().build();
        }

    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<Task>> getAllTasksByUserId(Authentication connectedUser) {
        return ResponseEntity.ok(taskService.getAllTasksByUserId(connectedUser));
    }

    @PatchMapping("/my-tasks/startTask")
    public ResponseEntity<Task> startTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return ResponseEntity.ok(taskService.startTime(requestBody, connectedUser));
    }

    @PatchMapping("/my-tasks/stopTask")
    public ResponseEntity<Task> stopTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return ResponseEntity.ok(taskService.stopTime(requestBody, connectedUser));
    }

    @PatchMapping("/my-tasks/completeTask")
    public ResponseEntity<Task> completeTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return ResponseEntity.ok(taskService.completeTask(requestBody, connectedUser));
    }

    @DeleteMapping("/my-tasks/deleteTask")
    public ResponseEntity<Void> deleteTask(@RequestBody Long requestBody, Authentication connectedUser) {
        taskService.deleteTask(requestBody, connectedUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/my-tasks/findByDates")
    public ResponseEntity<List<TaskReportResponse>> findTasksByDates(@RequestBody JsonNode dateRange, Authentication connectedUser) {
        return ResponseEntity.ok(taskService.findTasksByDates(dateRange, connectedUser));
    }

}
