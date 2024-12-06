package MaHyxa.Time.tracker.cache;

import MaHyxa.Time.tracker.task.Task;
import MaHyxa.Time.tracker.task.userStats.StatisticResponse;

public interface CacheService {
    Task cacheTask(Long id, String connectedUser);

    Task cacheUpdatedTask(Task task, String connectedUser);

    void clearTaskListCache(String connectedUser);

    void deleteCachedTask(Long id, String connectedUser);

    void clearFriendListCache(String connectedUser);

    StatisticResponse getStatistic(String connectedUser);

    void clearUserStatsCache(String connectedUser);
}
