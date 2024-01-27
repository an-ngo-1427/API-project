import { useNavigate } from 'react-router-dom';
import './EventDetails.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getEventIdThunk } from '../../store/eventdetail';

function EventDetails({ event }) {
    const navigate = useNavigate()
    const day = event.startDate.substring(0, 10);
    const time = event.startDate.substring(11, 16);
    const currEvent = useSelector(state=>state.currEvent);
    const dispatch = useDispatch()
    useEffect(()=>{
        if(event){
            dispatch(getEventIdThunk(event.id))
        }
    },[event,dispatch])
    const clickHandle = ()=>{
        navigate(`/events/${event.id}`)
    }
    return (
        <div className = 'event-detail-parent'>
        <div onClick={clickHandle} className='event-detail'>

                <img src={event.previewImage} alt='no preview image' />

            <div className='details'>
                <div className='add-info'>
                    <span>{day}</span>
                    <span>·</span>
                    <span>{time}</span>
                </div>

                <h3>{event.name}</h3>
                <span>{event.Venue.city}, {event.Venue.state}</span>
            </div>
        </div>
        <div>
            {currEvent?.description}
        </div>

        </div>
    )
}

export default EventDetails
