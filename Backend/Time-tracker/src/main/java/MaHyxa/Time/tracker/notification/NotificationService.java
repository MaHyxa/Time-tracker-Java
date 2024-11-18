package MaHyxa.Time.tracker.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate template;

    public void sendNotification(String connectedUser, Notification notification) {
        log.debug("Sending notification to user=[{}] with payload=[{}]", connectedUser, notification);
        template.convertAndSendToUser(connectedUser,"/notifications", notification);
    }
}
