package MaHyxa.Time.tracker.task.userStats;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface StatisticService {
    List<TaskReportResponse> findTasksByDates(JsonNode dateRange, Authentication connectedUser);

    StatisticResponse getStatistic(Authentication connectedUser);

    StatisticResponse updateStatistic(Authentication connectedUser);
}
