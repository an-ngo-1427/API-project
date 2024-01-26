import { useDispatch, useSelector } from "react-redux"
import { getGroupIdThunk } from "../../store/groupdetail";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import GroupForm from "../GroupForm/GroupForm";

function UpdateGroup(){
    const {groupId} = useParams()
    const dispatch = useDispatch()
    const group = useSelector(state=>state.currGroup);


    useEffect(()=>{
        dispatch(getGroupIdThunk(groupId))
    },[dispatch,groupId])
    return (
        <GroupForm props = {{group}}/>
    )
}

export default UpdateGroup
