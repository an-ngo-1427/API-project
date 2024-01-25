import { useNavigate } from 'react-router-dom';
import './EventDetails.css'

function EventDetails({ event }) {
    const navigate = useNavigate()
    const day = event.startDate.substring(0, 10);
    const time = event.startDate.substring(11, 16);
    const clickHandle = ()=>{
        navigate(`/events/${event.id}`)
    }
    return (
        <div onClick={clickHandle} className='item-detail'>

                <img src={event.previewImage} alt='no preview image' />

            <div className='details'>
                <div className='add-info'>
                    <span>{day}</span>
                    <span>.</span>
                    <span>{time}</span>
                </div>

                <h3>{event.name}</h3>
                <span>{event.Venue.city}, {event.Venue.state}</span>
            </div>
        </div>
    )
}

export default EventDetails
