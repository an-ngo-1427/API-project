import { NavLink, useNavigate } from 'react-router-dom'
import './HomePage.css'
import { useSelector } from 'react-redux'
function HomePage() {
    const sessionUser = useSelector(state => state.session.user)
    const navigate = useNavigate()
    return (
        <div className="home-page">
            <div className='introduction'>
                <div className='description'>
                    <div className = 'description text'>
                        <h3>
                            The people platform Where interests become friendships
                        </h3>
                        <p>
                            Manor we shall merit by chief wound no or would. Oh towards between subject passage sending mention or it. Sight happy do burst fruit to woody begin at. Assurance perpetual he in oh determine as. The year paid met him does eyes same.
                        </p>

                    </div>
                    <img className = 'main-image' src='https://i.pinimg.com/736x/3f/d3/23/3fd323c193f6f75e936ce0b976c7823e.jpg' />
                </div>
            </div>
            <div className='how'>
                <h3>How Meet Nemo works</h3>
                <p>Manor we shall merit by chief wound no or would</p>
            </div>
            <div className="main-items">
                <div className='item'>
                    <img className='main-item-image' src='https://i.pinimg.com/564x/e3/e5/dc/e3e5dc4143d77b3dcea61776d372928c.jpg'></img>
                    <NavLink title={'click to see all groups'} to={'/groups'}>See All Groups</NavLink>
                    <div>
                        See what groups are available in your area as well as online
                    </div>
                </div>
                <div className='item'>
                    <img className='main-item-image' src='https://image.shutterstock.com/image-vector/kawaii-chibi-blue-tang-clown-260nw-2019033005.jpg'></img>
                    <NavLink title={'click to see all the events'} to={`/events`}>Find an event</NavLink>
                    <div>
                        come to exiciting events that are happening in your community
                    </div>
                </div>
                <div className='item'>
                    <img className='main-item-image' src='https://www.shutterstock.com/image-vector/fish-nemo-dori-cartoon-characters-600nw-2396691033.jpg'></img>
                    <NavLink title={'click to create a new group'} to='/groups/new' className={!sessionUser ? 'disabledLink' : ""} >Start a new group</NavLink>
                    <div>
                        want to make a difference? start your own group!
                    </div>
                </div>
            </div>
            <div className = 'signup'>
                <button onClick={()=>{navigate('/signup')}}>Join Meet Nemo</button>
            </div>
        </div>
    )
}

export default HomePage;
