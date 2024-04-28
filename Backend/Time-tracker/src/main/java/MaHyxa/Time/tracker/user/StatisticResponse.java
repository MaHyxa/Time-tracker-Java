package MaHyxa.Time.tracker.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticResponse {
    private int totalUserTasks;
    private int activeUserTasks;
    private long totalTimeSpent;
    private int longestTask;

}
