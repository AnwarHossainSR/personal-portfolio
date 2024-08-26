/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

import Wave from '@/assets/img/wave.png';

const MainFooter = () => {
  const [height, setHeight] = useState<string | undefined>(undefined);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleClick = (value: any) => {
    window.open(value, '_blank');
  };
  useEffect(() => {
    setHeight(window.innerWidth <= 480 ? '10rem' : undefined);
    return setHeight(window.innerWidth <= 480 ? '10rem' : undefined);
  }, []);

  return (
    <div className="footer">
      <img
        src={Wave.src}
        alt="wave"
        style={{
          width: '100%',
          height,
        }}
      />
      <div className="f-content">
        <span>anwarmahedisr@gmail.com</span>
        <div className="f-icons">
          <RiInstagramFill
            color="var(--dark)"
            size="3rem"
            onClick={() =>
              handleClick('https://www.instagram.com/mahedi_hasan_sr/?hl=en')
            }
          />
          <FaFacebook
            color="var(--dark)"
            size="3rem"
            onClick={() => handleClick('https://www.facebook.com/MahediSR007')}
          />
          <FaGithub
            color="var(--dark)"
            size="3rem"
            onClick={() => handleClick('https://github.com/AnwarHossainSR')}
          />
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
