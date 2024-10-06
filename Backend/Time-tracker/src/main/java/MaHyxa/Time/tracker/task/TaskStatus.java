package MaHyxa.Time.tracker.task;

public enum TaskStatus {
    //If you want to change any on Status - better just add new one, most of the current logic is built around this ENUM, same as SQL queries.
    CREATED, // 0
    ACTIVE, // 1
    NOT_ACTIVE, // 2
    PENDING, // 3
    ACCEPTED, // 4
    REJECTED, // 5
    COMPLETED // 6
}
