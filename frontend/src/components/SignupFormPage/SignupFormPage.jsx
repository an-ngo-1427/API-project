import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './SignupForm.css'
function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const {closeModal} = useModal();
  const navigate = useNavigate()
  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})
    if (password === confirmPassword) {
      setErrors({});
      const data = await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
      if(data.errors){
        setErrors(data.errors)
      }else{
        closeModal();
      }
    }else{
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });

    }
  };

  const demoLogin = ()=>{
    let credential = 'thenemo'
    let password = 'password'
    return dispatch(sessionActions.login({credential,password}))
    .then(navigate('/'))
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p style={{color:'red'}}>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p style={{color:'red'}}>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p style={{color:'red'}}>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p style={{color:'red'}}>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p style={{color:'red'}}>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p style={{color:'red'}}>{errors.confirmPassword}</p>}
        <button className = 'demo-button' onClick={handleSubmit}type="submit">Sign Up</button>
      </form>
      <div className ='demo' style={{}} onClick={demoLogin}>login as demo user</div>
    </>
  );
}

export default SignupFormPage;
