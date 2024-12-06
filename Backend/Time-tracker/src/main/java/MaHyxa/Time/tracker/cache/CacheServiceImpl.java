package MaHyxa.Time.tracker.cache;

import MaHyxa.Time.tracker.task.Task;
import MaHyxa.Time.tracker.task.TaskRepository;
import MaHyxa.Time.tracker.task.userStats.StatisticResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Primary
@RequiredArgsConstructor
@Slf4j
public class CacheServiceImpl implements CacheService {

    private final TaskRepository taskRepository;
    private final Map<Long, Object> taskLocks = new ConcurrentHashMap<>();

    @Override
    @Cacheable(value = "userTasks", key = "'user=' + #connectedUser + ':task_id=' + #id")
    public Task cacheTask(Long id, String connectedUser) {
        Object lock = taskLocks.computeIfAbsent(id, k -> new Object());

        synchronized (lock) {
            try {
                Task task = taskRepository.findTaskByUserIdAndId(connectedUser, id);
                if(task == null) {
                    log.debug("Unable to cache task id=[{}] for user=[{}], because task wasn't found in database", id, connectedUser);
                }
                else {
                    log.debug("Cached task id=[{}] for user=[{}]", task.getId(), connectedUser);
                }
                return task;
            } finally {
                taskLocks.remove(id);
            }
        }
    }


    @Override
    @CachePut(value = "userTasks", key = "'user=' + #connectedUser + ':task_id=' + #task.id")
    public Task cacheUpdatedTask(Task task, String connectedUser) {
        taskRepository.save(task);
        log.debug("Update task id=[{}] for user=[{}]", task.getId(), connectedUser);
        return task;
    }

    @Override
    @CacheEvict(value = "taskList", key = "'user=' + #connectedUser")
    public void clearTaskListCache(String connectedUser) {
    }

    @Override
    @CacheEvict(value = "userTasks", key = "'user=' + #connectedUser + ':task_id=' + #id")
    public void deleteCachedTask(Long id, String connectedUser) {
    }

    @Override
    @CacheEvict(value = "friendList", key = "'user=' + #connectedUser")
    public void clearFriendListCache(String connectedUser) {
    }

    @Override
    @Cacheable(value = "userStats", key = "'user=' + #connectedUser")
    public StatisticResponse getStatistic(String connectedUser) {
        log.debug("Getting stats for user=[{}]", connectedUser);
        return StatisticResponse.builder()
                .totalUserTasks(taskRepository.findAllTasksByUser(connectedUser))
                .activeUserTasks(taskRepository.findAllActiveTasksByUser(connectedUser))
                .completeUserTasks(taskRepository.findAllCompleteTasksByUser(connectedUser))
                .longestTask(taskRepository.findLongestTaskByUser(connectedUser))
                .totalTimeSpent(taskRepository.findTasksTotalSpentTimeByUser(connectedUser))
                .build();
    }

    @Override
    @CacheEvict(value = "userStats", key = "'user=' + #connectedUser")
    public void clearUserStatsCache(String connectedUser) {
    }

}
