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

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class PersonalTaskDTO implements Serializable {

    private Long id;

    private String taskName;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    private Long spentTime;

    private String createdBy;

    private String answer;

    private int taskType;

    private int taskStatus;

}
