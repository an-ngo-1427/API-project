import { useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [err,setErrobj] = useState(false)

  useEffect(()=>{
    setErrobj(false)
    if(!email) setErrobj(true)
    if(!username || username.length<4) setErrobj(true)
    if(!firstName) setErrobj(true)
    if(!lastName) setErrobj(true)
    if(!password || password.length <6) setErrobj(true)
    if(!confirmPassword) setErrobj(true)
  },[email,username,firstName,lastName,password,confirmPassword])
  const handleSubmit = async(e) => {
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
        // .then(closeModal)
        // .catch(async (res) => {
        //   const data = await res.json();
        //   if (data?.errors) {
        //     setErrors(data.errors);
        //   }
        // });
    }else{
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });

    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
          className='modal-input'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email'
          />
        </label>
        {errors.email && <p style={{color:'red'}}>{errors.email}</p>}
        <label>
          Username
          <input
          className='modal-input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Username'
          />
        </label>
        {errors.username && <p style={{color:'red'}}>{errors.username}</p>}
        <label>
          First Name
          <input
          className = 'modal-input'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
          />
        </label>
        {errors.firstName && <p style={{color:'red'}}>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            className = 'modal-input'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder='Last Name'
          />
        </label>
        {errors.lastName && <p style={{color:'red'}}>{errors.lastName}</p>}
        <label>
          Password
          <input
          className = 'modal-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
        </label>
        {errors.password && <p style={{color:'red'}}>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            className = 'modal-input'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm Password'
          />
        </label>
        {errors.confirmPassword && <p style={{color:'red'}}>{errors.confirmPassword}</p>}
        <button disabled={err}type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
