package MaHyxa.Time.tracker.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Primary
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate template;

    @Override
    public void sendNotification(String connectedUser, Notification notification) {
        log.debug("Sending notification to user=[{}] with payload=[{}]", connectedUser, notification);
        template.convertAndSendToUser(connectedUser,"/notifications", notification);
    }
}
