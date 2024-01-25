import { useDispatch, useSelector } from 'react-redux';
import {getGroupsThunk } from '../../store/group'
import './GroupList.css'
import { useEffect } from 'react';
import GroupDetails from '../GroupDetails/GroupDetails';
import { getEventsThunk } from '../../store/event';
import { NavLink } from 'react-router-dom'
function GroupList() {
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups)

    const events = useSelector(state => state.events)

    const groupArr = Object.values(groups)
    console.log('group',groups)
    useEffect(() => {
        dispatch(getGroupsThunk())
        .then(()=>{dispatch(getEventsThunk())})
        console.log('entered')
    }, [dispatch])
    return (
        <div>
            <div className='head-links'>
                <NavLink to='/events'>Events</NavLink>
                <NavLink to='/groups'>Groups</NavLink>
            </div>
            <span className='group-caption'>groups in MeetUp</span>
            <div className='group-list'>
                {groupArr.map(group => <GroupDetails key={group.id} props={{ group, events }} />)}
            </div>

        </div>
    )
}

export default GroupList
