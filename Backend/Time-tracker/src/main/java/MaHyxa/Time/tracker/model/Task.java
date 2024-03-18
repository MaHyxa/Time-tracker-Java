package MaHyxa.Time.tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please name your task")
    private String taskName;

    @ManyToOne
    @JoinColumn
    private User user;

    private Long spentTime;

    private Long startTime;

    private boolean complete;

    private boolean isActive;

}
