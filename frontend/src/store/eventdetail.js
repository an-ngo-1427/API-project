
// normal action creators

// get event details by ID
const GET_EVENT_ID = '/events/GET_EVENT_ID'

const getEventId = (event)=>{
    return {
        type:GET_EVENT_ID,
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

// reducer
const initialState = {}
function eventIdReducer(state=initialState,action){
    switch (action.type){
        case GET_EVENT_ID:{
            const newObj = action.event
            return newObj
        }
    }
    return state;
}

export default eventIdReducer;
