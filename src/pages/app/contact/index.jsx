import React from 'react';
import { Helmet } from 'react-helmet-async';
import ContactComponnet from '../../../components/app/Contact';

const Contact = () => {
  return (
    <div>
      <Helmet>
        <title>Contact | Anwar Hossain | Portfolio</title>
      </Helmet>
      <ContactComponnet />
    </div>
  );
};

export default Contact;
