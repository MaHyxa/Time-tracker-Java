package MaHyxa.Time.tracker.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticResponse implements Serializable {

    private Integer totalUserTasks;
    private Integer activeUserTasks;
    private Integer completeUserTasks;
    private Long totalTimeSpent;
    private Long longestTask;

}
