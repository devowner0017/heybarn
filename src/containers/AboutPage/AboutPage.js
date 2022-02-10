import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './AboutPage.module.css';
import image from './about-us-1056.jpg';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About Heybarn',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Heybarn</h1>
          {/* <img className={css.coverImage} src={image} alt="My first ice cream." /> */}

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <p>Over half of Kiwi's told us that they would rather rent from other Kiwis than commercial operators</p>
            </div>

            <div className={css.contentMain}>
              <p>
              Kiwis need more space. Whether for storage, business, events or creative
pursuits, space is hard to find with commercial self-storage occupancy rates in
New Zealand consistently over 90%. Over 28% of lifestyle and rural properties
throughout New Zealand have quality sheds which are under-utilised and are
ready to rent. This equates to over 4 million square metres of under-utilised
space.
              </p>

              <p>
              We developed heybarn after realising a site wasn’t available which was
specifically designed to allow the owners of lifestyle and rural properties in New
Zealand to advertise their available shed space. By taking the best elements of
AirBnB, Tinder and commercial real estate agencies, the heybarn user
experience has been carefully designed with a focus on security, control and
maximising your chance of finding a successful rental arrangement.
              </p>


              <p>
              The heybarn founders have worked widely within rural New Zealand and live on
rural properties. They are excited to bring a potential new source of passive
income to New Zealand property owners, as well as encouraging Kiwis to look
outside of the urban centres to find a more sustainable alternative to commercial
building rentals.
              </p>

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

export default AboutPage;
