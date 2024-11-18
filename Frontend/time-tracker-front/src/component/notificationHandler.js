import { toast } from 'react-toastify';
import CustomToast from './CustomToast';

export const handleNotification = (notification) => {
    if (!notification) {
        console.error('Invalid notification data.');
        return;
    }

    switch (notification.status) {
        case 'REQUEST_CONN':
            toast.info(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        case 'REJECT_CONN':
            toast.error(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        case 'ACCEPT_CONN':
            toast.success(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        case 'TASK_ASSIGNED':
            toast.info(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        case 'TASK_ACCEPTED':
            toast.success(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        case 'TASK_REJECTED':
            toast.error(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        case 'TASK_COMPLETED':
            toast.success(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        case 'TASK_DELETED':
            toast.warn(
                <CustomToast
                    taskName={notification.taskName}
                    message={notification.message}
                />
            );
            break;

        default:
            toast.warn('Unhandled notification status:', notification.status);
    }
};
