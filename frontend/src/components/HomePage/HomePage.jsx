import { NavLink } from 'react-router-dom'
import nemoImg from '../../../../images/finding-nemo-artwork-kl9pn5yjupbums15.jpg'
import squirtImg from '../../../../images/imgbin-squirt-finding-nemo-turtle-illustration-BLBHxBxKXmarT9cDasPPzruip.jpg'
import groupImg from '../../../../images/pp_findingnemo_herobanner_19752_eb5648d2.jpeg'
import mainImg from '../../../../images/pngtree-finding-dory-vector-png-image_6886575.png'
import './HomePage.css'
import { useSelector } from 'react-redux'
function HomePage() {
    const sessionUser = useSelector(state => state.session.user)

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
                    <img className = 'main-image' src={mainImg} />
                </div>
            </div>
            <div className='how'>
                <h3>How Meetup works</h3>
                <p>Manor we shall merit by chief wound no or would</p>
            </div>
            <div className="main-items">
                <div className='item'>
                    <img className='main-item-image' src={nemoImg}></img>
                    <NavLink to={'/groups'}>See All Groups</NavLink>
                </div>
                <div className='item'>
                    <img className='main-item-image' src={squirtImg}></img>
                    <NavLink to={`/events`}>Find an event</NavLink>
                </div>
                <div className='item'>
                    <img className='main-item-image' src={groupImg}></img>
                    <NavLink replace={true} to='/groups/new' className={!sessionUser ? 'disabledLink' : ""} >Start a new group</NavLink>
                </div>
            </div>
        </div>
    )
}

export default HomePage;
