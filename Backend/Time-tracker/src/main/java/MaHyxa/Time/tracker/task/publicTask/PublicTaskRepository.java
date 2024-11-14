package MaHyxa.Time.tracker.task.publicTask;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PublicTaskRepository extends JpaRepository<PublicTask, Long> {
    @Query("SELECT t FROM PublicTask t WHERE t.userId = :id ORDER BY t.isComplete ASC, t.createdAt DESC")
    Page<PublicTask> getAllPublicTasksByUser(String id, Pageable pageable);

    PublicTask findPublicTaskByUserIdAndId(String user, Long id);
}
