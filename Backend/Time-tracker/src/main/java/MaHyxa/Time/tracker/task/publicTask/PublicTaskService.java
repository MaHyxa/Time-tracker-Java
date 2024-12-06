package MaHyxa.Time.tracker.task.publicTask;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;


public interface PublicTaskService {
    Page<PublicTaskDTO> getAllPublicTasksByUser(Authentication connectedUser, Pageable pageable);

    ResponseEntity<String> addPublicTask(JsonNode publicTask, Authentication connectedUser);

    ResponseEntity<String> deleteTask(Long requestBody, Authentication connectedUser);
}
