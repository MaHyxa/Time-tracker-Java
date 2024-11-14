package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.taskSession.TaskSession;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Task implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please name your task")
    @Column(columnDefinition = "TEXT")
    private String taskName;

    @Column(name="user_id")
    @NotBlank(message = "Please enter user ID")
    private String userId;

    @Email(message = "Invalid email format")
    private String userEmail;

    @JsonIgnore
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<TaskSession> taskSession = Collections.emptyList();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    private Long activeTaskSessionId;

    @Builder.Default
    private Long spentTime = 0L;

    private String createdBy;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private TaskType taskType;

    @Builder.Default
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private TaskStatus taskStatus = TaskStatus.CREATED;

}
