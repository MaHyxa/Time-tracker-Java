package MaHyxa.Time.tracker.task.taskSession;


import MaHyxa.Time.tracker.task.Task;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
@Slf4j
public class TaskSessionServiceImpl implements TaskSessionService {

    private final TaskSessionRepository taskSessionRepository;

    @Override
    public Long startSession(Task task) {
        TaskSession taskSession = TaskSession.builder()
                .startTime(LocalDateTime.now())
                .stopTime(null)
                .isActive(true)
                .task(task)
                .duration(0L)
                .build();
        taskSessionRepository.save(taskSession);
        log.info("Session for Task id=[{}] was created.", task.getId());
        return taskSession.getId();
    }

    @Override
    public Long stopSession(Long sessionId, Long taskId) {
        TaskSession taskSession = taskSessionRepository.findTaskSessionByIdAndTaskId(sessionId, taskId);
        if (!(taskSession == null)) {
            taskSession.setStopTime(LocalDateTime.now());
            taskSession.setActive(false);
            taskSession.setDuration(Duration.between(taskSession.getStartTime(), LocalDateTime.now()).toMillis());
            taskSessionRepository.save(taskSession);
            log.info("Session for Task id=[{}] was stopped.", taskId);
            return taskSession.getDuration();
        } else {
            return 0L;
        }
    }

    //using for midnight reset
    @Override
    public void deleteSession(Long sessionId, Long taskId) {
        TaskSession taskSession = taskSessionRepository.findTaskSessionByIdAndTaskId(sessionId, taskId);
        taskSessionRepository.delete(taskSession);
    }

    @Override
    public List<TaskSession> selectSessionsByDate(String startDate, String endDate, Long taskId) {
        return taskSessionRepository.selectSessionsByDate(Date.valueOf(startDate), Date.valueOf(endDate), taskId);
    }

}
