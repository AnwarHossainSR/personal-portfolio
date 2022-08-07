import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getAuthUserAction,
  GetSignInAction,
} from '../../redux/actions/UserAction';

const Login = () => {
  console.log('🚀 ~ file: Login.js ~ line 8 ~ Login',process.env.REACT_APP_API_KEY);
  const { isLoading, unAuthenticated, user, error } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (user && user.id) return navigate('/admin');
    if (unAuthenticated) {
      navigate('/login');
    } else {
      dispatch(getAuthUserAction());
    }
  }, [dispatch, navigate, unAuthenticated, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      GetSignInAction(emailRef.current.value, passwordRef.current.value)
    );
  };
  return (
    <>
      <Helmet>
        <title>Login | Anwar Hossain | Portfolio</title>
      </Helmet>
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
                autoComplete='off'
              />
            </div>
            <div className='login__container__field'>
              <input
                type='password'
                placeholder='password'
                name='password'
                ref={passwordRef}
                autoComplete='off'
              />
            </div>
            <div className='login__container__button'>
              <button className='button'>
                {isLoading === true ? 'loading..' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
