package MaHyxa.Time.tracker.task.taskSession;


import MaHyxa.Time.tracker.task.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TaskSessionService {

    private final TaskSessionRepository taskSessionRepository;


    public void startSession(Task task) {
        if (taskSessionRepository.findByTaskIdAndIsActiveTrue(task.getId()) == null) {
            TaskSession taskSession = TaskSession.builder()
                    .startTime(LocalDateTime.now())
                    .stopTime(LocalDateTime.now())
                    .isActive(true)
                    .task(task)
                    .duration(0L)
                    .build();
            taskSessionRepository.save(taskSession);
        } else stopSession(task);
    }

    public Long stopSession(Task task) {
        TaskSession taskSession = taskSessionRepository.findByTaskIdAndIsActiveTrue(task.getId());
        if (!(taskSession == null)) {
            taskSession.setStopTime(LocalDateTime.now());
            taskSession.setActive(false);
            taskSession.setDuration(Duration.between(taskSession.getStartTime(), LocalDateTime.now()).toMillis());
            taskSessionRepository.save(taskSession);
            return taskSession.getDuration();
        } else {
            startSession(task);
            stopSession(task);
            return 0L;
        }
    }

}
