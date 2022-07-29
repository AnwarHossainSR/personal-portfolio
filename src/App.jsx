import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { Route, Routes } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { themeContext } from './context/Context';
import About from './pages/about';
import Contact from './pages/contact';
import Home from './pages/home';
import Portfolio from './pages/portfolio';

const App = () => {
  const [showGoTop, setshowGoTop] = useState(false);
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  const ref = useRef(null);
  //DISPLAY HANDLER
  const handleVisibleButton = () => {
    const position = window.pageYOffset;
    if (position > 120) {
      return setshowGoTop(true);
    } else if (position < 120) {
      return setshowGoTop(false);
    }
  };

  //SCROLL LISTENER
  useEffect(() => {
    if (ref?.current.clientHeight < 300) {
      setshowGoTop(false);
    }
    window.addEventListener('scroll', handleVisibleButton);
  }, [ref]);
  return (
    <div
      className='App'
      style={{
        background: darkMode ? 'var(--black)' : '',
        color: darkMode ? 'white' : '',
      }}
      ref={ref}
    >
      <Navbar darkMode={darkMode} />
      <Routes>
        <Route path='/'>
          <Route index element={<Home darkMode={darkMode} />} />
          <Route path='portfolio' element={<Portfolio darkMode={darkMode} />} />
          <Route
            path='portfolio/:id'
            element={<Portfolio darkMode={darkMode} />}
          />
          <Route path='about' element={<About darkMode={darkMode} />} />
          <Route path='contact' element={<Contact darkMode={darkMode} />} />
        </Route>
      </Routes>
      <Footer />
      <div
        className={`${showGoTop ? 'scroll-top-visible' : 'scroll-top-hidden'}`}
        onClick={() => scroll.scrollToTop()}
      >
        <AiOutlineArrowUp />
      </div>
    </div>
  );
};

export default App;
