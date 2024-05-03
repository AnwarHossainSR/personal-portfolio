/* eslint-disable react/button-has-type */

'use client';

import { useRef } from 'react';

const LoginPage = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const error = false;
  const handleSubmit = (e: any) => {
    // eslint-disable-next-line no-console
    console.log('submit', e);
  };
  return (
    <div className="login">
      <div className="login__container">
        <h1>Sign In</h1>
        {error && <div className="error">Wrong credentials</div>}

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
