import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [errObj,setErrobj] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const res = await dispatch(sessionActions.login({ credential, password }))

    if(res.errors){
      setErrors(res.errors)
    }else{
      closeModal();
    }

  };

  const demoLogin = ()=>{
    let credential = 'thenemo'
    let password = 'password'
    return dispatch(sessionActions.login({credential,password}))
    .then(closeModal)
  }

  useEffect(()=>{
    let err = {}
    if(credential.length < 4) err.credential = 'credential must be longer than 4 characters'
    if(password.length < 6) err.password = 'password must be longer than 6 characters'

    setErrobj(err)
  },[password,credential])


  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            className='modal-input'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            />

        </label>
        <label>
          Password
          <input
            className='modal-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>
        {errors.message && <p style={{color:'red'}}>{errors.message}</p>}
        <button disabled={Object.values(errObj).length ? true:false} type="submit">Log In</button>
      </form>
      <span onClick={demoLogin} className='demo'> login as demo user</span>
    </>
  );
}

export default LoginFormModal;
