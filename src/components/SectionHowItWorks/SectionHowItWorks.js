import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import { IconCamera, IconComputer, IconHandshake } from '../../components';

import css from './SectionHowItWorks.module.css';

const SectionHowItWorks = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionHowItWorks.titleLineOne" />
      </div>

      <div className={css.steps}>
        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <IconCamera />
            {/* <FormattedMessage id="SectionHowItWorks.part1Title" /> */}
          </h2>
          <p className={css.stepText}>
            <FormattedMessage id="SectionHowItWorks.part1Text" />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <IconComputer />
            {/* <FormattedMessage id="SectionHowItWorks.part2Title" /> */}
          </h2>
          <p className={css.stepText}>
            <FormattedMessage id="SectionHowItWorks.part2Text" />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <IconHandshake />
            {/* <FormattedMessage id="SectionHowItWorks.part3Title" /> */}
          </h2>
          <p className={css.stepText}>
            <FormattedMessage id="SectionHowItWorks.part3Text" />
          </p>
        </div>
      </div>
    </div>
  );
};

SectionHowItWorks.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHowItWorks;
