package MaHyxa.Time.tracker.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private Long id;

    private String taskName;

    private Long spentTime;

    private Long startTime;

    private boolean isComplete;

    private boolean isActive;


}
