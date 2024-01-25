import './GroupDetails.css'
import { useNavigate } from "react-router-dom";
function GroupDetails({props}){

    const navigate = useNavigate();
    const group = props.group;
    const events = props.events;
    const eventArr = Object.values(events)
    let groupEvents = eventArr.filter(event=>event.groupId === group.id)
    console.log(group)
    const clickHandle = ()=>{
        navigate(`/groups/${group.id}`)
    }
    return(
        <div onClick={clickHandle} className = 'group-detail'>
            <img alt={'no preview picture'} src={group.previewImage}/>
            <div className = 'details'>
                <h2>{group.name}</h2>
                <span>{`${group.city}, ${group.state}`}</span>
                <p>{group.about}</p>
                <div className = 'add-info'>
                    <span>{`${groupEvents.length} Events`}</span>
                    <span>.</span>
                    <span>{group.private? 'Private':''}</span>
                </div>
            </div>
        </div>
    )
}
export default GroupDetails
