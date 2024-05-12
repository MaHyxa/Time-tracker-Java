package MaHyxa.Time.tracker.task.taskSession;


import MaHyxa.Time.tracker.task.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskSessionService {

    private final TaskSessionRepository taskSessionRepository;


    public void startSession(Task task) {
        if (taskSessionRepository.findActiveSessionByTaskId(task.getId()) == null) {
            TaskSession taskSession = TaskSession.builder()
                    .startTime(LocalDateTime.now())
                    .stopTime(null)
                    .isActive(true)
                    .task(task)
                    .duration(0L)
                    .build();
            taskSessionRepository.save(taskSession);
        }
    }

    public Long stopSession(Task task) {
        TaskSession taskSession = taskSessionRepository.findActiveSessionByTaskId(task.getId());
        if (!(taskSession == null)) {
            taskSession.setStopTime(LocalDateTime.now());
            taskSession.setActive(false);
            taskSession.setDuration(Duration.between(taskSession.getStartTime(), LocalDateTime.now()).toMillis());
            taskSessionRepository.save(taskSession);
            return taskSession.getDuration();
        } else {
            return 0L;
        }
    }

    public void deleteSession(Task task) {
        TaskSession taskSession = taskSessionRepository.findActiveSessionByTaskId(task.getId());
        taskSessionRepository.delete(taskSession);
    }

    public List<TaskSession> selectSessionsByDate(String startDate, String endDate, Long taskId) {
        return taskSessionRepository.selectSessionsByDate(Date.valueOf(startDate), Date.valueOf(endDate), taskId);
    }

}
