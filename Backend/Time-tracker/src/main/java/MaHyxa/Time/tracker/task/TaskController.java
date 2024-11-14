package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.config.RateLimitService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    private final RateLimitService rateLimitService;


    @GetMapping("/my-tasks")
    public ResponseEntity<List<PersonalTaskDTO>> getAllTasksByUserId(Authentication connectedUser) {
        return ResponseEntity.ok(taskService.getAllTasksDTOByUserId(connectedUser));
    }

    @PostMapping("/new")
    public ResponseEntity<?> createTask(@RequestBody JsonNode taskName, Authentication connectedUser) {
        if (connectedUser != null && rateLimitService.isAllowed(connectedUser.getName())) {
            return taskService.createTask(taskName, connectedUser);
        } else {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Please wait 3 seconds before creating a new Task");
        }
    }

    @GetMapping("/userStatistics")
    public ResponseEntity<StatisticResponse> getStatistic(Authentication connectedUser) {
        return ResponseEntity.ok(taskService.getStatistic(connectedUser));
    }

    @GetMapping("/updateUserStatistics")
    public ResponseEntity<StatisticResponse> updateStatistic(Authentication connectedUser) {
        return ResponseEntity.ok(taskService.updateStatistic(connectedUser));
    }

    @PatchMapping("/my-tasks/startTask")
    public ResponseEntity<?> startTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return taskService.startTime(requestBody, connectedUser);
    }

    @PatchMapping("/my-tasks/stopTask")
    public ResponseEntity<?> stopTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return taskService.stopTime(requestBody, connectedUser);
    }

    @PatchMapping("/my-tasks/completeTask")
    public ResponseEntity<?> completeTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return taskService.completeTask(requestBody, connectedUser);
    }

    @PatchMapping("/my-tasks/acceptTask")
    public ResponseEntity<?> acceptTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return taskService.acceptTask(requestBody, connectedUser);
    }

    @PatchMapping("/my-tasks/rejectTask")
    public ResponseEntity<?> rejectTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return taskService.rejectTask(requestBody, connectedUser);
    }

    @DeleteMapping("/my-tasks/deleteTask")
    public ResponseEntity<?> deleteTask(@RequestBody Long requestBody, Authentication connectedUser) {
        return taskService.deleteTask(requestBody, connectedUser);
    }

    @PostMapping("/my-tasks/findByDates")
    public ResponseEntity<List<TaskReportResponse>> findTasksByDates(@RequestBody JsonNode dateRange, Authentication connectedUser) {
        return ResponseEntity.ok(taskService.findTasksByDates(dateRange, connectedUser));
    }

}
