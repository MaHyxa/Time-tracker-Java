package MaHyxa.Time.tracker.task.publicTask;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/public-tasks")
@RequiredArgsConstructor
public class PublicTaskController {
    private final PublicTaskService publicTaskService;

    @GetMapping("/my-tasks")
    public ResponseEntity<Page<PublicTaskDTO>> getAllPublicTasksByUserId(Authentication connectedUser, @RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5);
        return ResponseEntity.ok(publicTaskService.getAllPublicTasksByUser(connectedUser, pageable));
    }

    @PostMapping("/addPublicTask")
    public ResponseEntity<String> addPublicTask(@RequestBody JsonNode publicTask, Authentication connectedUser) {
        if (publicTask == null || !publicTask.hasNonNull("taskName") || publicTask.get("taskName").asText().isEmpty()) {
            return new ResponseEntity<>("Task name cannot be empty.", HttpStatus.BAD_REQUEST);
        }
        else if (!publicTask.hasNonNull("assignedUsers") || publicTask.get("assignedUsers").isEmpty()) {
            return new ResponseEntity<>("You should assign at least one participant", HttpStatus.BAD_REQUEST);
        }
        else {
            return publicTaskService.addPublicTask(publicTask, connectedUser);
        }
    }

    @DeleteMapping("/my-tasks/deletePublicTask")
    public ResponseEntity<?> deleteTask(@RequestBody Long requestBody, Authentication connectedUser) {
        if (requestBody == null) {
            return new ResponseEntity<>("You can't delete task without id", HttpStatus.BAD_REQUEST);
        }
        else {
            return publicTaskService.deleteTask(requestBody, connectedUser);
        }
    }
}
