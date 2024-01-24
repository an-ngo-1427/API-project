import './GroupForm.css'
import {useState,useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { createGroupThunk } from '../../store/creategroup'
import {useNavigate, useParams} from 'react-router-dom'
import { csrfFetch } from '../../store/csrf';
import { getGroupIdThunk } from '../../store/groupdetail'
function GroupForm(){
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const{groupId} = useParams();

    let group = useSelector(state=>state.currGroup)
    // if(groupId) currGroup = await dispatch(getGroupIdThunk(groupId));
    // const [isGroup,setIsGroup] = useState(!Object.values(group).length)
    const [location,setLocation] = useState("");
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [isPrivate,setIsPrivate] = useState('');
    const [type,setType] = useState('');
    const [imgUrl,setImgUrl] = useState('');
    const [errObj,setErrObj] = useState({});
    const [formErr,setFormErr] = useState(false);
    const user = useSelector(state=>state.session.user)

    useEffect(()=>{
        if(!user) navigate('/')
        if(group.organizerId && user.id !== group.organizerId) navigate('/')
        setLocation(group.city ? `${group.city},${group.state}`:'')
        setName(group.name? group.name:'')
        setDescription(group.about? group.about:'')
        setIsPrivate(group.private? group.private:'')
        setType(group.type? group.type:'')
        setImgUrl(group.GroupImages?.length? group.GroupImages[0].url:'')
        if(groupId && !Object.values(group).length) dispatch(getGroupIdThunk(groupId))
    },[groupId,dispatch,group])



    const createGroupImage = async (groupId,imgObj)=>{
        const response = await csrfFetch(`/api/groups/${groupId}/images`,{
            method:'POST',
            body:JSON.stringify(imgObj)
        })
        const data = await response.json()
        return data
    }

    // updating group


    useEffect(()=>{

        let err = {}
        if(location.length <=0) err.location = 'location is required'
        if(name.length <= 0) err.name = 'name is required'
        if(description.length < 50) err.description = 'Description must be at least 50 characters long'
        if(!isPrivate) err.isPrivate = 'Visibility Type is required'
        if(!type) err.type = 'Group Type is required'
        if(
            (!imgUrl.includes('.png',imgUrl.length-5))&&
            (!imgUrl.includes('.jpeg',imgUrl.length-5))&&
            (!imgUrl.includes('.jpg',imgUrl.length-5))) err.imgUrl = "Image URL must end in .png, .jpg, or .jpeg"

        setErrObj(err);
    },[location,name,description,isPrivate,type,imgUrl])

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(Object.values(errObj).length) setFormErr(true)
        else{
            let city = location.split(',')[0];
            let state = location.split(',')[1];
            const reqObj = {
                name,
                about:description,
                type,
                private:isPrivate,
                city,
                state
            }

            const imgObj = {
                url:imgUrl,
                preview:true
            }
            let groupId;
            (dispatch(createGroupThunk(reqObj)))
                .then((group)=>{
                    groupId = group.id;
                    return createGroupImage(group.id,imgObj)
                }).then(()=>{navigate(`/groups/${groupId}`)})
        }
    }
    return(
        <div>
        <h1>{groupId? `Update your group`:`Start a New Group`}</h1>
        <form>
            <div className='form-section'>
                <h3>{`First, set your group's location.`}</h3>
                <p>{`Meetup groups meet locally, in person and online. We'll connect you with people
in your area, and more can join you online.`}</p>
                <input
                    label='location'
                    placeholder='City,STATE'
                    value = {location}
                    onChange={(e)=>{setLocation(e.target.value)}}
                />
                {formErr && <div style={{color:'red'}}>{errObj.location}</div>}
            </div>
            <div className='form-section'>
                <h3>{`What will your group's name be?`}</h3>
                <p>{`Choose a name that will give people a clear idea of what the group is about.
Feel free to get creative! You can edit this later if you change your mind.`}</p>
                <input
                    label='name'
                    placeholder='What is your group name'
                    value = {name}
                    onChange={(e)=>{setName(e.target.value)}}
                />
                {formErr && <div style={{color:'red'}}>{errObj.name}</div>}
            </div>
            <div className = 'form-section'>
                <h3>{`Now describe what your group will be about`}</h3>
                <p>{`People will see this when we promote your group, but you'll be able to add to it later, too.`}</p>
                <ol>
                    <li>{`What's the purpose of the group?`}</li>
                    <li>{`Who should join?`}</li>
                    <li>{`What will you do at your events?`}</li>
                </ol>
                <textarea
                    label = 'description'
                    placeholder='Please write at least 50 characters'
                    value = {description}
                    onChange={(e)=>{setDescription(e.target.value)}}
                />
                {formErr && <div style={{color:'red'}}>{errObj.description}</div>}
            </div>
            <div className = 'form-section'>
                <h3>{`Final steps...`}</h3>
                <div>
                    <p>{`Is this an in person or online group?`}</p>
                    <select placeholder='select one'
                        value = {type}
                        onChange={(e)=>{setType(e.target.value)}}
                    >
                        <option value=''>select one</option>
                        <option value='In person'>In person</option>
                        <option value='Online'>Online</option>
                    </select>
                    {formErr && <div style={{color:'red'}}>{errObj.type}</div>}
                </div>
                <div>
                    <p>{`Is this group private or public?`}</p>
                    <select
                        value = {isPrivate}
                        onChange={(e)=>{setIsPrivate(e.target.value)}}
                    >
                        <option value=''>select one</option>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                    </select>
                    {formErr && <div style={{color:'red'}}>{errObj.isPrivate}</div>}
                </div>
                <div>
                    <p>{`Please add an image url for your group below:`}</p>
                    <textarea
                    placeholder='Image Url'
                    value = {imgUrl}
                    onChange={(e)=>{setImgUrl(e.target.value)}}
                    />
                    {formErr && <div style={{color:'red'}}>{errObj.imgUrl}</div>}
                </div>
                <button
                    type='submit'
                    onClick={(e)=>{handleSubmit(e)}}
                >{!groupId? `Create group`:'Update group'}</button>
            </div>
        </form>

        </div>
    )
}

export default GroupForm
