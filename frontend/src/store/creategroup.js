//creating a new group

import { csrfFetch } from './csrf';
const CREATE_GROUP = '/groups/CREATE_GROUP'
export const createGroup = (group)=>{
    return{
        type:CREATE_GROUP,
        group
    }
}

// creating a group
export const createGroupThunk = (newGroup)=>async (dispatch)=>{
    const response = await csrfFetch('/api/groups',{
        method:'POST',
        body:JSON.stringify(newGroup)
    })
    const data = await response.json()

    if(response.ok){
        dispatch(createGroup(data))
    }
    return data
}

const initialState={}
function createGroupReducer (state = initialState,action){
    switch(action.type){
        case CREATE_GROUP:{
            return action.group
        }
    }
    return state
}

export default createGroupReducer
