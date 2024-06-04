package MaHyxa.Time.tracker.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticResponse {
    private Integer totalUserTasks;
    private Integer activeUserTasks;
    private Integer completeUserTasks;
    private Long totalTimeSpent;
    private Long longestTask;

}
