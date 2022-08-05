import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuthUserAction } from "../../redux/actions/UserAction";
import { userSuccess } from "../../redux/reducers/UserSLice";
import { auth } from "../../utils/firebase";

const Login = () => {
  const { unAuthenticated, user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (user && user.id) return navigate("/admin");
    if (unAuthenticated) {
      navigate("/login");
    } else {
      dispatch(getAuthUserAction());
    }
  }, [dispatch, navigate, unAuthenticated, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        dispatch(
          userSuccess({
            accessToken: userCredential.user.accessToken,
            email: userCredential.user.email,
            id: userCredential.user.uid,
          })
        );
        navigate("/admin");
      })
      .catch((error) => {
        console.log("catch", error);
        setError(true);
      });
  };
  return (
    <>
      <Helmet>
        <title>Login | Anwar Hossain | Portfolio</title>
      </Helmet>
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
    </>
  );
};

export default Login;
