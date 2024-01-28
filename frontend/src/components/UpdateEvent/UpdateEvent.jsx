import { useParams } from "react-router-dom";
import EventForm from "../EventForm";

function UpdateEvent(){
    const {eventId} = useParams();
    console.log(eventId)
    return (
        <EventForm eventId = {eventId}/>
    )
}

export default UpdateEvent;
