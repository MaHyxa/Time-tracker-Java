package MaHyxa.Time.tracker.task.publicTask;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PublicTaskRepository extends JpaRepository<PublicTask, Long> {
    @Query("SELECT t FROM PublicTask t WHERE t.userId = :id ORDER BY t.isComplete ASC, t.createdAt DESC")
    List<PublicTask> getAllPublicTasksByUser(String id);

    PublicTask findPublicTaskByUserIdAndId(String user, Long id);
}
