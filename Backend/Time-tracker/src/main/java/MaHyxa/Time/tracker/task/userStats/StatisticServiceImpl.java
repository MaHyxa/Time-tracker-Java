package MaHyxa.Time.tracker.task.userStats;

import MaHyxa.Time.tracker.cache.CacheService;
import MaHyxa.Time.tracker.task.Task;
import MaHyxa.Time.tracker.task.TaskRepository;
import MaHyxa.Time.tracker.task.taskSession.TaskSessionService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
@Slf4j
public class StatisticServiceImpl implements StatisticService{
    private final TaskSessionService taskSessionService;

    private final TaskRepository taskRepository;

    private final CacheService cacheService;
    @Override
    public List<TaskReportResponse> findTasksByDates(JsonNode dateRange, Authentication connectedUser) {

        String startDate = dateRange.get("startDate").asText().substring(0, 10);
        String endDate = dateRange.get("endDate").asText().substring(0, 10);

        List<TaskReportResponse> selectedTasksForReport = new ArrayList<>();

        List<Task> selectedTasks = taskRepository.findTasksByDateRange(Date.valueOf(startDate), Date.valueOf(endDate), connectedUser.getName());

        for (Task t: selectedTasks) {
            TaskReportResponse trr = TaskReportResponse.builder()
                    .task(t)
                    .taskSessionList(taskSessionService.selectSessionsByDate(startDate, endDate, t.getId()))
                    .build();
            selectedTasksForReport.add(trr);
        }

        return selectedTasksForReport;
    }

    @Override
    public StatisticResponse getStatistic(Authentication connectedUser) {
        return cacheService.getStatistic(connectedUser.getName());
    }

    @Override
    public StatisticResponse updateStatistic(Authentication connectedUser) {
        cacheService.clearUserStatsCache(connectedUser.getName());
        return cacheService.getStatistic(connectedUser.getName());
    }
}
