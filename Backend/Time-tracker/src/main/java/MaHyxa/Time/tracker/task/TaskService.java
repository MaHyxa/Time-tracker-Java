package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.userStats.StatisticResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface TaskService {
    List<PersonalTaskDTO> getAllTasksDTOByUserId(Authentication connectedUser);

    ResponseEntity<?> createTask(JsonNode taskName, Authentication connectedUser);

    ResponseEntity<?> updateTask(Long requestBody, Authentication connectedUser, boolean setActive, boolean setComplete);

    ResponseEntity<?> startTime(Long requestBody, Authentication connectedUser);

    ResponseEntity<?> stopTime(Long requestBody, Authentication connectedUser);

    ResponseEntity<?> completeTask(Long requestBody, Authentication connectedUser);

    ResponseEntity<?> deleteTask(Long requestBody, Authentication connectedUser);

    ResponseEntity<?> acceptTask(Long requestBody, Authentication connectedUser);

    ResponseEntity<?> rejectTask(Long requestBody, Authentication connectedUser);

}
