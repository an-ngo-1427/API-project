import './GroupDelete.css'

function GroupDelete(){

    // const yesClick = ()=>{

    // }
    return (
        <div className = 'group-delete'>
            <h2>Confirm Delete</h2>
            <p> Are you sure you want to remove this group?</p>
            <button>{`Yes (Delete Group)`}</button>
            <button>{`No (Keep Group)`}</button>

        </div>
    )
}

export default GroupDelete
