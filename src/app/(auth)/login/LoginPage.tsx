/* eslint-disable react/button-has-type */

'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { useLocalStorage } from '@/hooks';
import { api } from '@/lib/apiConfig';

const LoginPage = () => {
  const router = useRouter();
  const [, setValue] = useLocalStorage('token', {
    accessToken: '',
    refreshToken: '',
  });
  const [resMessage, setMessage] = useState('');
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const [error, setError] = useState('');
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const response: any = await api.post('/api/auth/login', {
      email,
      password,
    });

    if (response.data.status === 200) {
      const { message, accessToken, refreshToken } = response.data;
      setValue({ accessToken, refreshToken });
      setError('');
      setMessage(message);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } else {
      setMessage('');
      setError(response.data.message);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1>Sign In</h1>
        {resMessage && (
          <>
            <div className="success">{resMessage}</div> <br />
          </>
        )}
        {error && (
          <>
            <div className="error">{error}</div>
            <br />
          </>
        )}
        <form onSubmit={handleSubmit}>
          <div className="login__container__field">
            <input
              type="email"
              placeholder="email"
              name="email"
              ref={emailRef}
              autoComplete="off"
            />
          </div>
          <div className="login__container__field">
            <input
              type="password"
              placeholder="password"
              name="password"
              ref={passwordRef}
              autoComplete="off"
            />
          </div>
          <div className="login__container__button">
            <button className="button">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
