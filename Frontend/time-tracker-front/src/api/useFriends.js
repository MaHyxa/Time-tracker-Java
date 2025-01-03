import {useState, useCallback, useMemo} from 'react';
import useAxiosPrivate from "./useAxiosPrivate";
import {toast} from "react-toastify";

const useFriends = () => {
    const axiosPrivate = useAxiosPrivate();
    const [friends, setFriends] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);

    const loadFriends = useCallback(async () => {
        try {
            const response = await axiosPrivate.get('/api/v1/friends/my-friends');

            const friendsData = Array.isArray(response.data) ? response.data : [];

            if (friendsData.length > 0) {
                setFriends(friendsData);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
                setFriends([]);
            }
        } catch (err) {
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
            setFriends([]);
        }
    }, [axiosPrivate]);


    const activeFriends = useMemo(() => {
        return friends.filter(friend => friend.status === 2);
    }, [friends]);

    return { friends, activeFriends, isEmpty, loadFriends, setFriends };
};

export default useFriends;