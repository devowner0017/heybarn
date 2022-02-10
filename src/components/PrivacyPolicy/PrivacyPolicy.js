import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './PrivacyPolicy.module.css';

const PrivacyPolicy = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  // prettier-ignore
  return (
    <div className={classes}>
      <p className={css.lastUpdated}>Last updated: 27 January 2022</p>

      <p>
      heybarn Limited (“We”) are committed to protecting and respecting your privacy.
      </p>
      <p>
      This policy sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed by us. By visiting the heybarn Site, you are accepting and consenting to the practices described in this policy.
            </p>

      <h2>Scope of policy</h2>
      <p>
      This policy applies to your use of the heybarn Site. This policy does not apply to services or features which you may receive when you access Third Party websites – please refer to the relevant Third Party’s privacy policy.
      </p>

      <h2>Information we may collect from you</h2>
      <p>
      We may collect and process the following data about you:
      </p>
      <ol>
<li>
Information you give us: you may voluntarily provide us with information about you by completing forms on the heybarn Site, or by corresponding with us by email or phone. This includes information you provide when you register to use our Site, create a Listing or Advert, search Adverts or Listings, participate in social media functions on our Site, enter a competition, promotion or survey, and when you report a problem or provide feedback on our Site. The information you provide may include your name, address, email address and/or phone number, financial and credit card information, personal description and photograph(s).
</li>
<li>
Information we collect about you: We may automatically collect the following information when you visit our Site:
<ol>
  <li>
Technical data, including the Internet protocol (IP) address used to connect your computer to the Internet, your login information, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform;
  </li>
  <li>
  Information about your visit, including the full Uniform Resource Locators (URL) clickstream to, through and from our Site (including date and time), your search history on the Site, page response times, download errors, length of visits to certain pages, page interaction information (such as scrolling, clicks, and mouse-overs), and method used to browse away from the page and any phone number used to call our customer service number.
  </li>
</ol>
</li>
      </ol>
      <h2>Cookies</h2>
      <p>
      Our Site uses cookies to distinguish you from other users of our Site. We use cookies on our site where they are required for particular features to work, such as to allow you to remain logged in whilst you complete certain tasks. Most web browsers will allow you to set some control over cookies in your browser settings. This includes deleting them from your browser or disabling them altogether. If you do choose to set your browser to disable all cookies, this may affect your ability to use some of the features on our site.
      </p>
      <h2>How we may use the information</h2>
      <p>
      We may use the information held about you in the following ways:
            </p>
            <ol>
<li>
Information you give to us:
<ol>
<li>
   To carry out our obligations arising from any agreements entered into between you and us, and to provide you with the information, products and services that you request from us
  </li>
  <li>
    To notify you about changes to our service
    </li><li>
    To ensure that Content from our Site is presented in the most effective manner for you and for your computer.
        </li>
</ol>
</li>

<li>
Information we collect about you:
<ol>
<li>
To administer our Site and for internal operations, including troubleshooting, data analysis, testing, research, statistical and survey purposes
  </li>
  <li>
  To improve our Site to ensure that Content is presented in the most effective manner for you and your computer
    </li>
    <li>
    To allow you to participate in interactive features of our service, when you choose to do so
        </li>
        <li>
        As part of our efforts to keep our Site safe and secure
                </li>
                <li>
                To measure or understand the effectiveness of advertising we serve to you and others, and to deliver relevant advertising to you
                                </li>
</ol>
</li>

      </ol>
      <p>
      Any personal information collected, held, managed, used, disclosed, or transferred will be held in accordance with the New Zealand Privacy Act 2020 and other applicable laws. You may contact us to request access to your personal information, to unsubscribe from the mailing list or for other concerns regarding the privacy of your personal information, by emailing the Company’s Privacy Officer at <a href="mailto:privacy@heybarn.co.nz">privacy@heybarn.co.nz</a>.      </p>
      <p>
      We may share your information with selected third parties, including analytics and search engine providers that assist us in the improvement and optimisation of our site and in the event that we sell or buy any business or assets, in which case we may disclose your personal data to the prospective seller or buyer of such business or assets. If heybarn is acquired by a third party, personal data held about its customers will be one of the transferred assets.
            </p>


      <h2>Data storage</h2>
      <p>
      Your information will be stored securely within a New Zealand data centre. Although all information you provide to us is stored on our secure servers, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal data, heybarn cannot guarantee the security of data entered into our Site. Any transmission is at your own risk. Where you have developed a password which enables you to access certain parts of our Site, you are responsible for keeping this password confidential.
Heybarn will keep data for as long as required by law or as required to fulfil the original purpose for collecting the data.
      </p>
      <h2>Changes to our privacy policy</h2>
      <p>
      Any changes we make to our privacy policy in the future will be posted on the Site and, where appropriate, notified to you via email. Please check back frequently to see any updates or changes to our privacy policy.
      </p>
    </div>
  );
};

PrivacyPolicy.defaultProps = {
  rootClassName: null,
  className: null,
};

const { string } = PropTypes;

PrivacyPolicy.propTypes = {
  rootClassName: string,
  className: string,
};

export default PrivacyPolicy;
