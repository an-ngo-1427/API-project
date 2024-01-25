import { NavLink, useNavigate, useParams } from 'react-router-dom'
import './GroupShow.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getEventsThunk } from '../../store/event';
import EventDetails from '../EventDetails';
import { getGroupIdThunk } from '../../store/groupdetail';
import OpenModalButton from '../OpenModalButton';
import GroupDelete from '../GroupDelete';

function GroupShow() {
    const { groupId } = useParams();
    const [deleted,setDeleted] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const group = useSelector(state => state.currGroup)
    const user = useSelector(state=>state.session.user)
    const events = useSelector(state => state.events)
    const eventsArr = Object.values(events);

    eventsArr.sort((a, b) => {
        if (Date.parse(a.startDate) < Date.parse(b.startDate)) return 1
        else return -1


    })

    const groupEvents = eventsArr.filter(event => event.groupId === group.id)


    const upCommingEvents = groupEvents.filter(event => Date.parse(event.startDate) > Date.now());

    const pastEvents = groupEvents.filter(event => Date.parse(event.startDate) < Date.now());
    upCommingEvents.reverse();

    useEffect(() => {
        dispatch(getGroupIdThunk(groupId))
        dispatch(getEventsThunk())
    }, [dispatch,groupId])

    useEffect(()=>{
        if(deleted) navigate('/groups')

    },[deleted,navigate])

    if (!Object.values(group).length) {

        return null
    }
    return (
        <div>
            <NavLink to={`/groups`}>{`< Groups`}</NavLink>
            <div className='group-header'>
                <div className='group-pic'>
                    {group.GroupImages.map(image=><img key={image.id} src ={image.url}/>)}
                </div>
                <div className='over-view'>
                    <h2>{group.name}</h2>
                    <div className='location'>{`${group.city}, ${group.state}`}</div>
                    <div className='add-info'>
                        <span>{`${groupEvents.length} Events`}</span>
                        <span>.</span>
                        <span>{group.private ? 'Private' : ''}</span>
                    </div>
                    <div>{`Organized by ${group?.Organizer?.firstName} ${group?.Organizer?.lastName}`}</div>
                    {user && user.id !== group.organizerId && <button onClick={() => { window.alert('feature comming soon') }} className='join-group'>Join this group</button>}
                    {user && user.id === group.organizerId &&
                        <div className='organizer button'>
                            <button className='create-events'><NavLink to={`/groups/${groupId}/events/new`}>Create an event</NavLink></button>
                            <button className= 'update'><NavLink to={`/groups/${groupId}/edit`}>Update</NavLink></button>
                            <button className = 'delete'>
                                <OpenModalButton
                                modalComponent = {<GroupDelete props = {{group,navigate,setDeleted}}/>}
                                buttonText = 'Delete'

                                />
                            </button>
                        </div>
                    }


                </div>
            </div>
            <div className='group-detail-body'>
                <div className='group-description'>
                    <div className='organinzer'>
                        <h2>Organizer</h2>
                        <span>{group.Organizer.firstName} {group.Organizer.lastName}</span>

                    </div>
                    <div className='detail-about'>
                        <h3>What we are about</h3>
                        <p>{group.about}</p>
                    </div>
                </div>
                <h2>Events</h2>
                <div className='upcomming'>
                    <h3>{`Upcomming events (${upCommingEvents.length})`}</h3>
                    {upCommingEvents.map(event => <EventDetails key={event.id} event={event} />)}
                </div>
                <div className='past-events'>
                    <h3>{`Past events (${pastEvents.length})`}</h3>
                    {pastEvents.map(event => <EventDetails key={event.id} event={event} />)}
                </div>

            </div>

        </div>
    )
}

export default GroupShow
