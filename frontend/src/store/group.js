

// normal action creators

// getting all groups
const GET_GROUPS = '/groups/GET_GROUPS'
export const getGroups = (groups)=>{
    return {
        type:GET_GROUPS,
        groups
    }
}

// getting one group by Id


// thunk action creators
export const getGroupsThunk = ()=>async (dispatch)=>{

    const response = await fetch('/api/groups');
    const data = await response.json();
    if(response.ok){
        dispatch(getGroups(data.Groups));
        return data
    }
    return data
}

// getting group by specified Id



// reducer
const initialState = {}
const groupReducer = (state=initialState,action)=>{
    switch(action.type){
        case GET_GROUPS:{
            const newObj = {...state}

            action.groups.forEach(group=>{newObj[group.id] = group})
            return newObj;
        }

    }
    return state
}

export default groupReducer
