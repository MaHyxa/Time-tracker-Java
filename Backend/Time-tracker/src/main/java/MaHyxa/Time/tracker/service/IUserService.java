package MaHyxa.Time.tracker.service;

import MaHyxa.Time.tracker.model.User;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.Optional;

public interface IUserService {

    User createUser (User user);

    Optional<User> getUserById (Long id);

    void deleteUser (Long id);

    User changeUserDetails (Long id, String name, String surname, String nickname) throws ChangeSetPersister.NotFoundException;

    User changeUserPassword (Long id, String password) throws ChangeSetPersister.NotFoundException;




}
