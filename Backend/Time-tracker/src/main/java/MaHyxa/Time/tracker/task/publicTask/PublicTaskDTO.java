package MaHyxa.Time.tracker.task.publicTask;

import MaHyxa.Time.tracker.task.Task;
import MaHyxa.Time.tracker.task.taskSession.TaskForPublicTaskDTO;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PublicTaskDTO {

    private String taskName;

    private LocalDateTime createdAt;

    private boolean isComplete;

    private List<TaskForPublicTaskDTO> assignedTasks;
}
