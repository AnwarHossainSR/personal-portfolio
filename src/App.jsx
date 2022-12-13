import { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { Route, Routes } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import AppLayout from './components/Layout/AppLayout';
import { themeContext } from './context/Context';
import About from './pages/app/about';
import Contact from './pages/app/contact';
import Home from './pages/app/home';
import Portfolio from './pages/app/portfolio';
import PlayList from './pages/app/youtubePlaylist';

const App = () => {
  const [showGoTop, setShowGoTop] = useState(false);
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  const ref = useRef(null);
  //DISPLAY HANDLER
  const handleVisibleButton = () => {
    const position = window.pageYOffset;
    if (position > 120) {
      return setShowGoTop(true);
    } else if (position < 120) {
      return setShowGoTop(false);
    }
  };
  //SCROLL LISTENER
  useEffect(() => {
    if (ref?.current.clientHeight < 300) setShowGoTop(false);
    window.addEventListener('scroll', handleVisibleButton);
    return () => window.removeEventListener('scroll', handleVisibleButton);
  }, []);

  return (
    <div
      className="App"
      style={{
        background: darkMode ? 'var(--black)' : '',
        color: darkMode ? 'white' : '',
      }}
      ref={ref}
    >
      <Routes>
        <Route path="/" element={<AppLayout darkMode={darkMode} />}>
          <Route index element={<Home darkMode={darkMode} />} />
          <Route path="portfolio" element={<Portfolio darkMode={darkMode} />} />
          <Route path="play-list" element={<PlayList darkMode={darkMode} />} />
          <Route
            path="portfolio/:id"
            element={<Portfolio darkMode={darkMode} />}
          />
          <Route path="about" element={<About darkMode={darkMode} />} />
          <Route path="contact" element={<Contact darkMode={darkMode} />} />
        </Route>
      </Routes>
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
