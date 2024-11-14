package MaHyxa.Time.tracker.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {


    /**
     * This is a simple realization of RateLimiter. If you need more control over API endpoints - you can change logic (add it as Interceptor for example).
     * All what it does for now: Create Bucket with 1 token, which is refilling every 3 seconds with 1 token once used. If there's no tokens in Bucket - it's not allowing to access endpoint.
     */

    private final ConcurrentHashMap<String, Bucket> userBuckets = new ConcurrentHashMap<>();

    public Bucket getBucketForUser(String userId) {
        return userBuckets.computeIfAbsent(userId, id -> createBucket());
    }

    private Bucket createBucket() {
        Bandwidth limit = Bandwidth.classic(1, Refill.greedy(1, Duration.ofSeconds(3)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public boolean isAllowed(String userId) {
        Bucket bucket = getBucketForUser(userId);
        // Probe if the user has enough capacity in their bucket
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        return probe.isConsumed();
    }

}
