package MaHyxa.Time.tracker.task.taskSession;

import MaHyxa.Time.tracker.task.Task;

import java.util.List;

public interface TaskSessionService {
    Long startSession(Task task);

    Long stopSession(Long sessionId, Long taskId);

    List<TaskSession> selectSessionsByDate(String startDate, String endDate, Long taskId);

    //using for midnight reset
    void deleteSession(Long sessionId, Long taskId);

}
