package MaHyxa.Time.tracker.task.taskSession;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskForPublicTaskDTO {

    private LocalDateTime completedAt;

    private String userEmail;

    private boolean isComplete;

    private String answer;
}
