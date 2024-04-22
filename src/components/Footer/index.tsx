'use client';

import Wave from '@/assets/img/wave.png';
// import Facebook from '@iconscout/react-unicons/icons/uil-facebook';
// import Gitub from '@iconscout/react-unicons/icons/uil-github';
// import Insta from '@iconscout/react-unicons/icons/uil-instagram';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const MainFooter = () => {
  const [height, setHeight] = useState<string | undefined>(undefined)
  const handleClick = (value: any) => {
    window.open(value, '_blank');
  };
  useEffect(() => {
    return setHeight(window.innerWidth <= 480 ? '15rem' : undefined);
  }, []);
    
  return (
    <div className="footer">
      <Image src={Wave} alt="wave"  style={{
          width: '100%',
          height: height,
        }} />
      <div className="f-content">
        <span>anwarmahedisr@gmail.com</span>
        <div className="f-icons">
          {/* <Insta
            color="var(--dark)"
            size="3rem"
            onClick={() =>
              handleClick('https://www.instagram.com/mahedi_hasan_sr/?hl=en')
            }
          />
          <Facebook
            color="var(--dark)"
            size="3rem"
            onClick={() => handleClick('https://www.facebook.com/MahediSR007')}
          />
          <Gitub
            color="var(--dark)"
            size="3rem"
            onClick={() => handleClick('https://github.com/AnwarHossainSR')}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
