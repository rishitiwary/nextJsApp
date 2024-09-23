import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const notify = (limit) => toast.error(`Only ${limit} item(s) can be added per order.`);


const Notification = ({ notificatonData }) => {
    useEffect(() => {
        if (notificatonData.status) {
            notify(notificatonData.limit);
        }
    }, [notificatonData]);

    return (
        <div>

            <Toaster />
        </div>
    );
};
export default Notification;