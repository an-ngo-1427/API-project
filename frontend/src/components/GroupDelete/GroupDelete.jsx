
import { csrfFetch } from '../../store/csrf'
import './GroupDelete.css'
import { useModal } from '../../context/Modal';


function GroupDelete({props}){
    const {closeModal} = useModal();

    const group = props.group

    const setDeleted = props.setDeleted


    const yesClick = async(e)=>{
        e.preventDefault()
       csrfFetch(`/api/groups/${group.id}`,{
            method:'DELETE'
        }).then(response=>{setDeleted(response.ok)})
        closeModal()
    }


    return (
        <div className = 'group-delete'>
            <h2>Confirm Delete</h2>
            <p> Are you sure you want to remove this group?</p>
            <button className = 'yes-button' type="submit" onClick={(e)=>yesClick(e)}>{`Yes (Delete Group)`}</button>
            <button className = 'no-button' onClick={closeModal}>{`No (Keep Group)`}</button>

        </div>
    )
}

export default GroupDelete
