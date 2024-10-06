package MaHyxa.Time.tracker.friends;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Friends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long friendship;

    @JoinColumn(nullable = false)
    private String user;

    @JoinColumn(nullable = false)
    private String requestedBy;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private RelationshipStatus status;

}
