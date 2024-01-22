import { useDispatch, useSelector } from 'react-redux'
import './EventList.css'
import EventDetails from '../EventDetails';
import { useEffect } from 'react';
import { getEventsThunk } from '../../store/event';
import { NavLink } from 'react-router-dom';

function EventList() {
    const dispatch = useDispatch()
    const events = useSelector(state => state.events);
    let eventsArr = Object.values(events);
    eventsArr.sort((a, b) => {
        if (Date.parse(a.startDate) < Date.parse(b.startDate)) return 1
        else return -1
    })

    useEffect(() => {
        dispatch(getEventsThunk());
    }, [dispatch])
    return (
        <div>
            <div className='head-links'>
                <NavLink to='/events'>Events</NavLink>
                <NavLink to='/groups'>Groups</NavLink>
            </div>
            <span className='event-caption'>{`events in Meetup (${eventsArr.length})`}</span>
            <div className='events-list'>
                {eventsArr.map(event => <EventDetails key={event.id} event={event} />)}

            </div>

        </div>
    )
}

export default EventList
