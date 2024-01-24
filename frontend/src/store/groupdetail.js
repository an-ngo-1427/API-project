
// normal action creators
const GET_GROUP_ID = '/groups/GET_GROUP_ID'
export const getGroupId = (group)=>{
    return{
        type:GET_GROUP_ID,
        group
    }
}


// thunk action creators

export const getGroupIdThunk = (groupId)=>async (dispatch)=>{
    const response = await fetch(`/api/groups/${groupId}`)
    const data = await response.json();
    if(response.ok){
        dispatch(getGroupId(data));
        return data;
    }

    return data
}

// reducer
const initialState={}

function groupIdReducer(state=initialState,action){
    switch(action.type){
        case GET_GROUP_ID:{
            const newObj = action.group
            return newObj
        }
    }
    return state
}
export default groupIdReducer;
