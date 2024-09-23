import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';




const ShowMessage = ({ messageData }) => {
 
  
    useEffect(() => {
        if (messageData.status) {
if(messageData.type==='success'){
    toast.success(messageData.message);
}else{
    toast.error(messageData.message);
}
            
        }
    }, [messageData]);

    return (
        <div>

            <Toaster />
        </div>
    );
};
export default ShowMessage;