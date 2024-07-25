package MaHyxa.Time.tracker.task.publicTask;

import MaHyxa.Time.tracker.task.Task;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class PublicTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please name your task")
    @Column(columnDefinition = "TEXT")
    private String taskName;

    @Column(name="user_id")
    private String userId;

    private LocalDateTime createdAt;

    private boolean isComplete;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Task> assignedTasks;

}

