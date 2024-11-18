package MaHyxa.Time.tracker.notification;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Notification {
    private NotificationStatus status;
    private String message;
    private String taskName;
}
