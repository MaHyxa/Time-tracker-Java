package MaHyxa.Time.tracker.service;

import MaHyxa.Time.tracker.model.User;
import MaHyxa.Time.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {


    private final UserRepository userRepository;
    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User changeUserDetails(Long id, String name, String surname, String nickname) throws ChangeSetPersister.NotFoundException {
        Optional<User> thisUser = this.getUserById(id);
        if(thisUser.isPresent())
        {
            User updatedUser = thisUser.get();
            updatedUser.setName(name);
            updatedUser.setNickname(surname);
            updatedUser.setSurname(nickname);
            return userRepository.save(updatedUser);
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public User changeUserPassword(Long id, String password) throws ChangeSetPersister.NotFoundException {
        Optional<User> thisUser = this.getUserById(id);
        if(thisUser.isPresent())
        {
            User updatedUser = thisUser.get();
            updatedUser.setPassword(password);
            return userRepository.save(updatedUser);
        }
        else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

}
