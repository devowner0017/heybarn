import React from 'react';

import { ExternalLink, NamedLink } from '../../../components';
import { FormattedMessage } from '../../../util/reactIntl';

import css from './SectionStory.module.css';

import imageLeft from './image-left.png';
import imageRight from './image-right.png';
import config from '../../../config';

export const SectionStory = () => {
  const { siteFacebookPage, siteInstagramPage } = config;

  return (
    <div className={css.root}>
      <div className={css.container}>
        <div className={css.leftImage}>
          <img src={imageLeft} alt="Story" />
        </div>
        <div className={css.content}>
          <h2 className={css.title}>
            <FormattedMessage id="SectionStory.title" />
          </h2>
          <p className={css.text}>
            <FormattedMessage id="SectionStory.text" />
          </p>
          <div className={css.followUsWrapper}>
            <h3 className={css.followUs}>
              <FormattedMessage id="SectionStory.followUs" />
            </h3>

            <div className={css.socialIcons}>
              <ExternalLink
                className={css.socialIcon}
                href={siteFacebookPage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </ExternalLink>
              <ExternalLink
                className={css.socialIcon}
                href={siteInstagramPage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </ExternalLink>
            </div>

            <NamedLink name="AboutPage" className={css.followUsLink}>
              <FormattedMessage id="SectionStory.followUsLink" />
            </NamedLink>
          </div>
        </div>
        <div className={css.rightImage}>
          <img src={imageRight} alt="Story" />
          <div className={css.followUsWrapperMobile}>
            <h3 className={css.followUs}>
              <FormattedMessage id="SectionStory.followUs" />
            </h3>

            <div className={css.socialIcons}>
              <ExternalLink
                className={css.socialIcon}
                href={siteFacebookPage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </ExternalLink>
              <ExternalLink
                className={css.socialIcon}
                href={siteInstagramPage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </ExternalLink>
            </div>

            <NamedLink name="AboutPage" className={css.followUsLink}>
              <FormattedMessage id="SectionStory.followUsLink" />
            </NamedLink>
          </div>
        </div>
      </div>
    </div>
  );
};

const FacebookIcon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} {...props}>
    <path
      data-name="Icon awesome-facebook-f"
      d="m14.696 16.517.816-5.314h-5.1V7.754a2.657 2.657 0 0 1 3-2.871h2.318V.359A28.268 28.268 0 0 0 11.612 0c-4.2 0-6.944 2.545-6.944 7.153V11.2H0v5.314h4.668v12.849h5.745V16.517Z"
      fill="#222"
    />
  </svg>
);

const InstagramIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    viewBox="0 0 26.779 26.779"
    {...props}
  >
    <path
      data-name="Icon metro-instagram"
      d="M21.499 0H4.279a4.292 4.292 0 0 0-4.28 4.28v17.219a4.292 4.292 0 0 0 4.28 4.28h17.22a4.292 4.292 0 0 0 4.28-4.28V4.28A4.292 4.292 0 0 0 21.499 0ZM8.252 11.278h9.277a4.909 4.909 0 1 1-9.274 0Zm14.3 0v9.666a1.616 1.616 0 0 1-1.611 1.611H4.829a1.616 1.616 0 0 1-1.611-1.611v-9.666h2.52a7.326 7.326 0 1 0 14.294 0h2.52Zm0-5.64a.808.808 0 0 1-.806.806h-1.607a.808.808 0 0 1-.806-.806v-1.61a.808.808 0 0 1 .806-.806h1.611a.808.808 0 0 1 .806.806Z"
      fill="#222"
    />
  </svg>
);
