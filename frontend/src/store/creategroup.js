//creating a new group


import { csrfFetch } from './csrf';

const CREATE_GROUP = '/groups/CREATE_GROUP'
export const createGroup = (group)=>{
    return{
        type:CREATE_GROUP,
        group
    }
}

// updatting group
const UPDATE_GROUP = '/groups/UPDATE_GROUP'
export const updateGroup = (group)=>{
    return {
        type:UPDATE_GROUP,
        group
    }
}

// creating a group
export const createGroupThunk = (newGroup)=>async (dispatch)=>{
    const response = await csrfFetch('/api/groups',{
        method:'POST',
        body:JSON.stringify(newGroup)
    })
    const data = await response.json({})

    if(response.ok){
        dispatch(createGroup(data))
    }
    return data
}

// updatting group thunks
export const updateGroupThunk = (groupId,group)=>async (dispatch)=>{

            const response = await csrfFetch(`/api/groups/${groupId}`,{
                method:'PUT',
                body:JSON.stringify(group)
            })
            const data = await response.json();
            if(response.ok){
                dispatch(updateGroup(group));
            }
            return data
}

const initialState={}
function createGroupReducer (state = initialState,action){
    switch(action.type){
        case CREATE_GROUP:{
            return action.group
        }
        case UPDATE_GROUP:{
            return action.group
        }
    }
    return state
}

export default createGroupReducer
