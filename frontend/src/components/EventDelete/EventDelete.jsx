import { useModal } from '../../context/Modal'
import { csrfFetch } from '../../store/csrf'
import './EventDelete.css'

function EventDelete({props}){
    const {event,setDeleted} = props
    const {closeModal} = useModal();
    // console.log(props)
    const handleClick = (e)=>{
        e.preventDefault()
        csrfFetch(`/api/events/${event.id}`,{method:'DELETE'})
        .then(response=>{setDeleted(response.ok)})
        closeModal()
    }
    return(
        <div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this event?</p>
            <button className='yes-button'onClick={(e)=>{handleClick(e)}}>Yes (Delete Event)</button>
            <button className = 'no-button'onClick={closeModal}>No (Keep Event)</button>
        </div>
    )
}

export default EventDelete
