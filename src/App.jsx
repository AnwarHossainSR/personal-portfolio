import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { Route, Routes } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { themeContext } from './context/Context';
import Blogs from './pages/blogs';
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
        background: darkMode ? 'black' : '',
        color: darkMode ? 'white' : '',
      }}
      ref={ref}
    >
      <Navbar />
      <Routes>
        <Route path='/'>
          <Route index element={<Home />} />
          <Route path='portfolio' element={<Portfolio />} />
          <Route path='blogs' element={<Blogs />} />
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
