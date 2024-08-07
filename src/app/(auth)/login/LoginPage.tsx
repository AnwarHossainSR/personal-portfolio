/* eslint-disable react/button-has-type */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Loader from '@/components/common/Loader';
import { api } from '@/lib/apiConfig';
import { getAuthenticatedUser } from '@/lib/cookie';

const LoginPage = () => {
  const router = useRouter();
  const [resMessage, setMessage] = useState('');
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const response: any = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { message } = response.data;
      setError('');
      setMessage(message);
      router.push('/admin/dashboard');
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.log('error', err);
      setMessage('');
      setError(err.response.data.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    !user &&
      getAuthenticatedUser()
        .then(data => {
          setUser(data);
          if (data) {
            router.push('/admin/dashboard');
          }
        })
        .then(() => {
          setLoading(false);
        });
  }, []);

  if (loading) return <Loader />;

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
