import Facebook from '@iconscout/react-unicons/icons/uil-facebook';
import Gitub from '@iconscout/react-unicons/icons/uil-github';
import Insta from '@iconscout/react-unicons/icons/uil-instagram';
import Wave from '../../../assets/img/wave.png';

const Footer = () => {
  const handleClick = (value) => {
    window.open(value, '_blank');
  };
  return (
    <div className="footer">
      <img
        src={Wave}
        alt=""
        style={{
          width: '100%',
          height: window.innerWidth <= 480 ? '15rem' : undefined,
        }}
      />
      <div className="f-content">
        <span>anwarmahedisr@gmail.com</span>
        <div className="f-icons">
          <Insta
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
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
