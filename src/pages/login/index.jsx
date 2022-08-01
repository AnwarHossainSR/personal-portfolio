import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
      } else {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        localStorage.setItem('accessToken', userCredential.user.accessToken);
        navigate('/admin/dashboard');
      })
      .catch((error) => {
        console.log('catch', error);
        setError(true);
      });
  };
  return (
    <div className='login'>
      <div className='login__container'>
        <h1>Sign In</h1>
        {error && <div className='error'>Wrong credentials</div>}

        <form onSubmit={handleSubmit}>
          <div className='login__container__field'>
            <input
              type='email'
              placeholder='email'
              name='email'
              ref={emailRef}
            />
          </div>
          <div className='login__container__field'>
            <input
              type='password'
              placeholder='password'
              name='password'
              ref={passwordRef}
            />
          </div>
          <div className='login__container__button'>
            <button className='button'>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
