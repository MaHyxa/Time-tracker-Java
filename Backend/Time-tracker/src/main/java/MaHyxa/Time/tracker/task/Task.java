package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.task.taskSession.TaskSession;
import MaHyxa.Time.tracker.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
    private String taskName;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "task")
    @ToString.Exclude
    private List<TaskSession> taskSession;

    private LocalDateTime createdAt;

    private Long spentTime;

    private boolean isComplete;

    private boolean isActive;

}
