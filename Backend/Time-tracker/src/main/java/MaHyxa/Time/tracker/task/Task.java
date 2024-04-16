package MaHyxa.Time.tracker.task;

import MaHyxa.Time.tracker.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Long spentTime;

    private Long startTime;

    private boolean complete;

    private boolean isActive;

}
