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
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
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
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>
        {errors.message && <p>{errors.message}</p>}
        <button disabled={Object.values(errObj).length ? true:false} type="submit">Log In</button>
      </form>
      <span onClick={demoLogin} className='demo'> login as demo user</span>
    </>
  );
}

export default LoginFormModal;
