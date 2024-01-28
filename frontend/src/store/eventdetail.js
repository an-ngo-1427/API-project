
// normal action creators

import { csrfFetch } from "./csrf";

// get event details by ID
const GET_EVENT_ID = '/events/GET_EVENT_ID'

const getEventId = (event)=>{
    return {
        type:GET_EVENT_ID,
        event
    }
}

const UPDATE_EVENT = '/events/UPDATE_EVENT'
const updateEvent = (event)=>{
    return {
        type:UPDATE_EVENT,
        event
    }
}
// thunk action creators

export const getEventIdThunk = (eventId)=> async (dispatch)=>{
    const response = await fetch(`/api/events/${eventId}`);
    const data = await response.json();
    if(response.ok){
        dispatch(getEventId(data))
        return data
    }
    return data
}

// update an event
export const updateEventThunk = (eventId,event)=> async (dispatch)=>{
    console.log(event)
    const response = await csrfFetch(`/api/events/${eventId}/`,{
        method:'PUT',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(event)
    })
    const data = await response.json()
    console.log(data)
    if(response.ok){
        dispatch(updateEvent(data))
    }
    return data
}



// reducer
const initialState = {}
function eventIdReducer(state=initialState,action){
    switch (action.type){
        case GET_EVENT_ID:{
            const newObj = action.event
            return newObj
        }
        case UPDATE_EVENT:{
            const newObj = action.event
            return newObj
        }
    }
    return state;
}

export default eventIdReducer;
