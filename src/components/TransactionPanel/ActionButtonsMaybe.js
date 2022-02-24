import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { PrimaryButton, SecondaryButton } from '..';

import css from './TransactionPanel.module.css';

// Functional component as a helper to build ActionButtons for
// provider when state is preauthorized
const ActionButtonsMaybe = props => {
  const {
    className,
    rootClassName,
    showButtons,
    affirmativeInProgress,
    negativeInProgress,
    affirmativeError,
    affirmativeDisabled,
    negativeError,
    affirmativeAction,
    negativeAction,
    hideAffirmative,
    hideNegative,
    affirmativeText,
    negativeText,
    title,
  } = props;

  const buttonsDisabled = affirmativeInProgress || negativeInProgress;

  const acceptErrorMessage = affirmativeError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.acceptSaleFailed" />
    </p>
  ) : null;
  const declineErrorMessage = negativeError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.declineSaleFailed" />
    </p>
  ) : null;

  const classes = classNames(rootClassName || css.actionButtons, className);

  return showButtons ? (
    <div className={classes}>
      {!!title && <h3>{title}</h3>}
      <div className={css.actionErrors}>
        {acceptErrorMessage}
        {declineErrorMessage}
      </div>
      <div className={css.actionButtonWrapper}>
        {!hideNegative && (
          <SecondaryButton
            inProgress={negativeInProgress}
            disabled={buttonsDisabled}
            onClick={negativeAction}
          >
            {negativeText || <FormattedMessage id="TransactionPanel.declineButton" />}
          </SecondaryButton>
        )}
        {!hideAffirmative && (
          <PrimaryButton
            inProgress={affirmativeInProgress}
            disabled={affirmativeDisabled || buttonsDisabled}
            onClick={affirmativeAction}
          >
            {affirmativeText || <FormattedMessage id="TransactionPanel.acceptButton" />}
          </PrimaryButton>
        )}
      </div>
    </div>
  ) : null;
};

export default ActionButtonsMaybe;
