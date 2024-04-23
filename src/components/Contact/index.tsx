/* eslint-disable no-console */

'use client';

import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';

import { useTheme } from '@/providers/context/Context';

const Contact = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const form = useRef<HTMLFormElement>(null);
  const [done, setDone] = useState(false);
  const sendEmail = (e: any) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_psafvyf',
        'template_9td2zv8',
        form?.current ?? '',
        'aBmlK_uW6eFlu2K9e'
      )
      .then(
        () => {
          setDone(true);
          form?.current?.reset();
        },
        error => {
          console.log(error.text);
        }
      );
  };
  return (
    <div className="contact-form" id="contact">
      {/* left side copy and paste from work section */}
      <div className="w-left">
        <div className="awesome">
          {/* darkMode */}
          <span style={{ color: darkMode ? 'white' : '' }}>Get in Touch</span>
          <span>Contact me</span>
          <div className="blur s-blur1" style={{ background: '#ABF1FF94' }} />
        </div>
      </div>
      {/* right side form */}
      <div className="c-right">
        <form ref={form} onSubmit={sendEmail}>
          <input
            type="text"
            name="user_name"
            className="user"
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="user_email"
            className="user"
            placeholder="Email"
            required
          />
          <textarea
            name="message"
            className="user"
            placeholder="Message"
            required
          />
          <input type="submit" value="Send" className="button" />
          <span>{done && 'Thanks for Contacting me'}</span>
          <div
            className="blur c-blur1"
            style={{ background: 'var(--purple)' }}
          />
        </form>
      </div>
    </div>
  );
};

export default Contact;
