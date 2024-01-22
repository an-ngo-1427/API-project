
import { useNavigate, useParams } from 'react-router-dom';
import './EventShow.css'
import { useDispatch, useSelector } from 'react-redux';
import { getEventIdThunk } from '../../store/eventdetail';
import { useEffect } from 'react';
function EventShow() {
    const dispatch = useDispatch()
    const { eventId } = useParams()
    const event = useSelector(state => state.currEvent);
    const navigate = useNavigate()

    const dayStart = event.startDate?.substring(0, 10);
    const timeStart = event.startDate?.substring(11, 16);
    const dayEnd = event.endDate?.substring(0, 10);
    const timeEnd = event.endDate?.substring(11, 16);

    let data;
    let organizer;
    Object.values(event).length ? organizer = event.Group.Organizer : organizer = '';
    if (Object.values(event).length) console.log(event)
    if (Object.values(organizer).length) console.log(organizer)
    useEffect(() => {
        data = dispatch(getEventIdThunk(eventId));
    }, [dispatch])

    if (data?.message) return <h1>{data.message}</h1>
    if (!Object.values(event).length) return null;

    const handleClick = ()=>{
        navigate(`/groups/${event.groupId}`)
    }
    return (
        <div className = 'event-show'>
            <div className='event-header'>
                <div  className='event-name'>
                    <h2>{event.name}</h2>
                    <span>{`Hosted By ${organizer.firstName} ${organizer.lastName}`}</span>
                </div>
                <div className='event-overview'>
                    <img src='https://www.rollingstone.com/wp-content/uploads/2023/05/Finding-Nemo-Anniversary.jpg?w=1581&h=1054&crop=1'></img>
                    <div>
                        <div onClick = {handleClick} className='event-group'>
                            <img src='https://www.rollingstone.com/wp-content/uploads/2023/05/Finding-Nemo-Anniversary.jpg?w=1581&h=1054&crop=1'></img>
                            <div className='group-name'>
                                <h3>{event.Group.name}</h3>
                                <span>{event.Group.private ? 'Private' : 'Public'}</span>
                            </div>
                        </div>
                        <div className='event-info'>
                            <div>{`START: ${dayStart} . ${timeStart}`}</div>
                            <div>{`END: ${dayEnd} . ${timeEnd}`}</div>
                            <div>{event.type}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='event-detail-description'>
                <h2>Details</h2>
                <p>{event.description}</p>
            </div>

        </div>
    )
}

export default EventShow;
