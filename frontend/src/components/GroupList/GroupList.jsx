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
    if(groupArr.length) console.log(groupArr)
    useEffect(() => {
        dispatch(getGroupsThunk());
        dispatch(getEventsThunk());
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
