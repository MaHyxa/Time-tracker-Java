package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.taskSession.TaskSession;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please name your task")
    @Column(columnDefinition = "TEXT")
    private String taskName;

    @Column(name="user_id")
    private String userId;

    @Email(message = "Invalid email format")
    private String userEmail;

    @JsonIgnore
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<TaskSession> taskSession;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    private Long spentTime;

    private boolean isComplete;

    private boolean isActive;

    private String createdBy;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private TaskType taskType;

}
