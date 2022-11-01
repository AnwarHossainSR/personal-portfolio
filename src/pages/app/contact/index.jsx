import { Helmet } from 'react-helmet-async';
import ContactComponent from '../../../components/app/Contact';

const Contact = () => {
  return (
    <div>
      <Helmet>
        <title>Contact | Anwar Hossain | Portfolio</title>
      </Helmet>
      <ContactComponent />
    </div>
  );
};

export default Contact;
