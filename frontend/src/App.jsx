import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage/LoginFormPage';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import logo from '../../images/Iconshock-Finding-Nemo-Nemo.256.png'
import HomePage from './components/HomePage/HomePage';
import GroupList from './components/GroupList';
import GroupShow from './components/GroupShow/GroupShow';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);


  return (
    <div className='page'>
      <div className='header'>

        <img onClick={() => { navigate('/') }} className='logo' src={logo} />
        <nav className='nav-head'>
          <Navigation isLoaded={isLoaded} />

        </nav>
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
        element: <GroupList/>
      },
      {
        path: '/groups/:groupId',
        element: <GroupShow/>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
