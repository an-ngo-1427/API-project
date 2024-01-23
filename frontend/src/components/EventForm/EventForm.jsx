import { useSelector } from 'react-redux';
import './EventForm.css'
import { useEffect, useState } from 'react';

function EventForm(){
    const group = useSelector(state=>state.currGroup);
    const [name,setName] = useState('');
    const [type,setType] = useState('');
    const [isPrivate,setIsPrivate] = useState('');
    const [price,setPrice] = useState('');
    const [startDate,setStartDate] = useState('');
    const [endDate,setEndDate] = useState('');
    const [imgUrl,setImgUrl] = useState('');
    const [description,setDescription] = useState('');
    const [errObj,setErrObj] = useState({});
    const [formErr,setFormErr] = useState(false);

    useEffect(()=>{
        let err = {}
        if(name.length < 5) err.name = "Name must be at least 5 characters"
        if(type.length <= 0) err.type = "Event type is required"
        if(isPrivate.length <=0 ) err.isPrivate = "Event visibility is required"
        if(price.length <= 0) err.price = 'Price is required'
        if(startDate.length <=0) err.startDate = "Start date is required"
        if(endDate.length <= 0 ) err.endDate = 'End date is required'
        if(     (!imgUrl.includes('.png',imgUrl.length-5))&&
                (!imgUrl.includes('.jpeg',imgUrl.length-5))&&
                (!imgUrl.includes('.jpg',imgUrl.length-5))) err.imgUrl = "Image URL must end in .png, .jpg, or .jpeg"
        if(description.length < 30) err.description = "Please include at least 30 characters"

        setErrObj(err);
    },[name,type,isPrivate,price,startDate,endDate,imgUrl,description])

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(Object.values(errObj).length) setFormErr(true)
        console.log(errObj)

    }
    return(
        <div className = 'event-form'>
            <h1>{`Create an event for ${group.name}`}</h1>
            <form>
                <div className = 'form-section'>
                    <h3>{`What is the name of your event?`}</h3>
                    <input
                        placeholder='Event Name'
                        value={name}
                        onChange={(e)=>{setName(e.target.value)}}
                    />
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.name}</div>}
                <div className = 'form-section'>
                    <h3>{`Is this an in person or online event?`}</h3>
                    <select
                        value={type}
                        onChange={(e)=>{setType(e.target.value)}}
                    >
                        <option value="">select one</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.type}</div>}
                <div className = 'form-section'>
                    <h3>{`Is this event private or public?`}</h3>
                    <select
                        value={isPrivate}
                        onChange={(e)=>{setIsPrivate(e.target.value)}}
                    >
                        <option value="">select one</option>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                    </select>
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.isPrivate}</div>}
                <div className = 'form-section'>
                    <h3>{`What is the price for your event?`}</h3>
                    <input type="text" placeholder='0'
                        value={price}
                        onChange={(e)=>{setPrice(e.target.value)}}
                    />
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.price}</div>}
                <div className = 'form-section'>
                    <h3>{`When does your event start?`}</h3>
                    <input
                        value={startDate}
                        placeholder='MM/DD/YYYY HH:mm AM'
                        onChange={(e)=>setStartDate(e.target.value)}
                    />
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.startDate}</div>}
                <div className = 'form-section'>
                    <h3>{`When does your event end?`}</h3>
                    <input
                        value={endDate}
                        placeholder='MM/DD/YYYY HH:mm AM'
                        onChange={(e)=>setEndDate(e.target.value)}
                    />
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.endDate}</div>}
                <div className = 'form-section'>
                    <h3>{`Please add in image url for your event below:`}</h3>
                    <input
                        value={imgUrl}
                        placeholder='Image URL'
                        onChange={(e)=>{setImgUrl(e.target.value)}}
                    />
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.imgUrl}</div>}
                <div className = 'form-section'>
                    <h3>{`Please describe your event:`}</h3>
                    <input
                        value={description}
                        placeholder='Please include at least 30 characters'
                        onChange={(e)=>{setDescription(e.target.value)}}
                    />
                </div>
                {formErr && <div style={{color:'red'}}>{errObj.description}</div>}
                <button type='submit' onClick={(e)=>{handleSubmit(e)}}>Create Event</button>
            </form>
        </div>
    )
}

export default EventForm;
