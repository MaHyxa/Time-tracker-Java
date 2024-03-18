import java.sql.Date;
import java.sql.Time;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.chrono.Chronology;
import java.util.LinkedList;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

public class Main {
    public static void main(String[] args) throws InterruptedException {


        long l = System.nanoTime();
        long p = System.nanoTime();

        long t = p - l;

        long HH = TimeUnit.NANOSECONDS.toHours(t);
        long MM = TimeUnit.NANOSECONDS.toMinutes(t) % 60;
        long SS = TimeUnit.NANOSECONDS.toSeconds(t) % 60;

        String timeInHHMMSS = String.format("%02d:%02d:%02d", HH, MM, SS);


        System.out.println(timeInHHMMSS);

        LinkedList<Integer> s = new LinkedList<>();
        s.add(1);
        s.add(2);
        s.add(3);
        s.add(4);
        s.add(5);
        s.add(6);

        s.remove((Integer) 6);

        System.out.println("Final LinkedList:" + s);




    }
}