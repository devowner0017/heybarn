import React, { useState } from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '..';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
  Button,
} from '../../components';
import { sendAdminEmail } from '../../util/api';
import css from './ContactPage.module.css';

const initialState = {
  name: '',
  email: '',
  message: '',
  messageSubmitted: false,
  messageSubmitting: false
};
const ContactPage = () => {
  const [{ name, email, message, messageSubmitting, messageSubmitted }, setState] = useState(
    initialState
  );

  const clearState = () => {
    setState({ ...initialState });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };
  // prettier-ignore
  const handleSubmit = (e) => {
    e.preventDefault()
    setState(prevState => ({ ...prevState, messageSubmitting: true }));

const data ={
  to: "shane@shattered.dev",
      message: {
        subject: 'HEYBARN - NEW CONTACT FROM CONTACT PAGE',
        body:
          'A user has contacted you via the CONTACT PAGE',
      },
      content: {
        name,
        email,
        message,
      },
    }
  sendAdminEmail(data).then(() => {
    clearState()
    setState(prevState => ({ ...prevState, messageSubmitted: true }));
  }).finally(()=> {
    setState(prevState => ({ ...prevState, messageSubmitting:  false }));
  })
}


  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'ContactPage',
        description: 'About Heybarn',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Get in touch!</h1>

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <p>
                Heybarn is your local marketplace connecting Kiwis with space, to Kiwis that need
                it.
              </p>
            </div>

            <div className={css.contentMain}>
              {!messageSubmitted ? (
                <>
                  <div className={css.formGroup}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={css.field}
                      placeholder="Name"
                      value={name}
                      required
                      onChange={handleChange}
                    />
                    <p className="help-block text-danger"></p>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      className={css.field}
                      placeholder="Email"
                      required
                      onChange={handleChange}
                    />
                    <p className="help-block text-danger"></p>
                  </div>
                  <div className={css.formGroup}>
                    <textarea
                      name="message"
                      id="message"
                      className={css.field}
                      rows="4"
                      placeholder="Message"
                      value={message}
                      required
                      onChange={handleChange}
                    ></textarea>
                    <p className="help-block text-danger"></p>
                  </div>
                  <Button onClick={handleSubmit} inProgress={messageSubmitting}>
                    Send Message
                  </Button>
                </>
              ) : (
                <div className={css.formGroup}>
                  Thanks for reaching out! We'll be in touch within 48 hours.
                </div>
              )}
            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default ContactPage;
