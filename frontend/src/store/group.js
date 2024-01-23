

// normal action creators

// getting all groups
const GET_GROUPS = '/groups/GET_GROUPS'
export const getGroups = (groups)=>{
    return {
        type:GET_GROUPS,
        groups
    }
}

// //creating a new group
// const CREATE_GROUP = '/groups/CREATE_GROUP'
// export const createGroup = (group)=>{
//     return{
//         type:CREATE_GROUP,
//         group
//     }
// }
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

// // creating a group
// export const createGroupThunk = (newGroup)=>async (dispatch)=>{
//     const response = await fetch('/api/groups',{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json'
//         },
//         body:JSON.stringify(newGroup)
//     })
//     data.
//     if(response.ok){
//         dispatch(createGroup())
//     }
// }



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
