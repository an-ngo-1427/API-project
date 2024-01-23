import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage/LoginFormPage';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import logo from '../../images/android-chrome-192x192.png'
import HomePage from './components/HomePage/HomePage';
import GroupList from './components/GroupList';
import GroupShow from './components/GroupShow/GroupShow';
import EventList from './components/EventList';
import EventShow from './components/EventShow';
import GroupForm from './components/GroupForm/GroupForm';
import { useSelector } from 'react-redux'
import {NavLink} from 'react-router-dom'
import EventForm from './components/EventForm';
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);


  return (
    <div className='page'>
      <div className='header'>

        <img onClick={() => { navigate('/') }} className='logo' src={logo} />
        <div className = 'head-session'>
          {user && <NavLink to='/groups/new'>Start a new group</NavLink>}
          <nav className='nav-head'>
            <Navigation isLoaded={isLoaded} />
          </nav>

        </div>
      </div>

      {isLoaded && <Outlet />}
    </div>


  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/groups',
        element: <GroupList />
      },
      {
        path: '/groups/:groupId',
        element: <GroupShow />
      },
      {
        path: '/groups/new',
        element: <GroupForm />
      },
      {
        path: '/events',
        element: <EventList />
      },
      {
        path:'/events/new',
        element: <EventForm/>
      },
      {
        path: '/events/:eventId',
        element: <EventShow />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
