import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { InlineTextButton, NamedLink } from '..';

import css from './SectionBanner.module.css';

const SectionBanner = props => {
  const { rootClassName, className, header, content } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
        <h2 className={css.bannerHeader}>{header}</h2>
        <p className={css.bannerContent}>If you're looking for listings or renters in the Manawatu or lower South Island, you're in the right place; we're focusing on your area. If you're not, don't go away! We're coming to the rest of New Zealand very soon. Please <NamedLink className={css.link} name={"SignupPage"}>sign up and create an account</NamedLink>, we'll let you know as soon as we are in your area. For more information about our plans, read more here</p>
    </div>
  );
};

SectionBanner.defaultProps = { rootClassName: null, className: null };

SectionBanner.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionBanner;
