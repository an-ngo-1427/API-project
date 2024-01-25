
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import './EventShow.css'
import { useDispatch, useSelector } from 'react-redux';
import { getEventIdThunk } from '../../store/eventdetail';
import { useEffect, useRef,useState } from 'react';
import { FaRegClock } from "react-icons/fa";
import { MdOutlinePriceCheck } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";
import OpenModalButton from '../OpenModalButton';
import EventDelete from '../EventDelete/EventDelete';

function EventShow() {
    const dispatch = useDispatch()
    const { eventId } = useParams()
    const event = useSelector(state => state.currEvent);
    const navigate = useNavigate()
    const [deleted,setDeleted] = useState(false)
    const user = useSelector(state=>state.session.user);
    const dayStart = event.startDate?.substring(0, 10);
    const timeStart = event.startDate?.substring(11, 16);
    const dayEnd = event.endDate?.substring(0, 10);
    const timeEnd = event.endDate?.substring(11, 16);

    let data = useRef(null);
    let organizer;
    Object.values(event).length ? organizer = event.Group.Organizer : organizer = '';

    useEffect(() => {
        data.current = dispatch(getEventIdThunk(eventId));
        if(deleted){
            navigate(`/groups/${event.Group.id}`)
        }
    }, [dispatch,eventId,deleted,event?.Group?.id,navigate])

    if (data.current?.message) return <h1>{data.current.message}</h1>
    if (!Object.values(event).length) return null;

    const handleClick = () => {
        navigate(`/groups/${event.groupId}`)
    }
    return (
        <div className='event-show'>
            <NavLink to="/events">{`< Events`}</NavLink>
            <i className='material-icons'>icon</i>
            <div className='event-header'>
                <div className='event-name'>
                    <h2>{event.name}</h2>
                    <span>{`Hosted By ${organizer.firstName} ${organizer.lastName}`}</span>
                </div>
                <div className='event-overview'>
                    <img src='https://www.rollingstone.com/wp-content/uploads/2023/05/Finding-Nemo-Anniversary.jpg?w=1581&h=1054&crop=1'></img>
                    <div>
                        <div onClick={handleClick} className='event-group'>
                            <img src='https://www.rollingstone.com/wp-content/uploads/2023/05/Finding-Nemo-Anniversary.jpg?w=1581&h=1054&crop=1'></img>
                            <div className='group-name'>
                                <h3>{event.Group.name}</h3>
                                <span>{event.Group.private ? 'Private' : 'Public'}</span>
                            </div>
                        </div>
                        <div className='event-info'>
                            <div className='event-info-item'>
                                <span className='icon'><FaRegClock /></span>
                                <div>
                                    <div>{`START: ${dayStart} . ${timeStart}`}</div>
                                    <div>{`END: ${dayEnd} . ${timeEnd}`}</div>

                                </div>
                            </div>
                            <div className='event-info-item'>
                                <div className='icon'><MdOutlinePriceCheck /></div>
                                {event.price <= 0? <div>FREE</div> : <div>{event.price} $</div>}
                            </div>
                            <div className='event-info-item'>
                                <div className='icon'><GrLocationPin /></div>
                                <div>{event.type}</div>

                                {organizer.id === user?.id && <OpenModalButton
                                    modalComponent={<EventDelete props ={{event,setDeleted}}/>}
                                    buttonText='Delete'
                                />}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='event-detail-description'>
                <h2>Description</h2>
                <p>{event.description}</p>
            </div>

        </div>
    )
}

export default EventShow;
