import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink } from '..';

import css from './SectionBanner.module.css';

const SectionBanner = props => {
  const { rootClassName, className, header, content } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
        <h2 className={css.bannerHeader}>{header}</h2>
        <p className={css.bannerContent}>{content}</p>
    </div>
  );
};

SectionBanner.defaultProps = { rootClassName: null, className: null };

SectionBanner.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionBanner;
