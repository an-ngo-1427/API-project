import './EventDetails.css'

function EventDetails({ event }) {
    console.log(event)
    const day = event.startDate.substring(0, 10);
    const time = event.startDate.substring(11, 16);
    console.log(day)
    console.log(time)
    return (
        <div className='event-details'>
            <div className='event-image'>
                <img src='https://www.rollingstone.com/wp-content/uploads/2023/05/Finding-Nemo-Anniversary.jpg?w=1581&h=1054&crop=1' />
            </div>
            <div className='event-description'>
                <div className='add-info'>
                    <span>{day}</span>
                    <span>.</span>
                    <span>{time}</span>
                </div>

                <h3>{event.name}</h3>
                <span>{event.Venue.city}, {event.Venue.state}</span>
            </div>
        </div>
    )
}

export default EventDetails
