package MaHyxa.Time.tracker.task;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheService {

    private final TaskRepository taskRepository;
    private final Map<Long, Object> taskLocks = new ConcurrentHashMap<>();

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


    @CachePut(value = "userTasks", key = "'user=' + #connectedUser + ':task_id=' + #task.id")
    public Task cacheUpdatedTask(Task task, String connectedUser) {
        taskRepository.save(task);
        log.debug("Update task id=[{}] for user=[{}]", task.getId(), connectedUser);
        return task;
    }

    @CacheEvict(value = "taskList", key = "'user=' + #connectedUser")
    public void clearTaskListCache(String connectedUser) {
    }

    @CacheEvict(value = "userTasks", key = "'user=' + #connectedUser + ':task_id=' + #id")
    public void deleteCachedTask(Long id, String connectedUser) {
    }

    @CacheEvict(value = "friendList", key = "'user=' + #connectedUser")
    public void clearFriendListCache(String connectedUser) {
    }

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

    @CacheEvict(value = "userStats", key = "'user=' + #connectedUser")
    public void clearUserStatsCache(String connectedUser) {
    }

}
