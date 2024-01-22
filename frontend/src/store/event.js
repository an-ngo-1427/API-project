

//normal actio creators
const GET_EVENTS = '/events/GET_EVENTS'
export const getEvents = (events)=>{
    return {
        type:GET_EVENTS,
        events
    }
}


// thunk action creators

// fetching all events
export const getEventsThunk = ()=> async(dispatch)=>{
    const response = await fetch('/api/events');
    const data = await response.json();
    if(response.ok){
        dispatch(getEvents(data.Events));
        return data
    }
    return data
}

// event reducer
const initialState = {}
function eventReducer(state=initialState,action){
    switch(action.type){
        case GET_EVENTS:{
            const newObj = {...state};
            action.events.forEach(event=>newObj[event.id] = event)
            return newObj
        }
    }
    return state
}

export default eventReducer;
