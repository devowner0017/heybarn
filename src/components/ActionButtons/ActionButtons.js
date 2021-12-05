import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { PrimaryButton, SecondaryButton } from '..';

import css from './ActionButtons.module.css';

// Functional component as a helper to build ActionButtons for
// provider when state is preauthorized
const ActionButtons = props => {
  const {
    className,
    rootClassName,
    showButtons,
    affirmativeInProgress,
    negativeInProgress,
    affirmativeError,
    negativeError,
    affirmativeAction,
    negativeAction,
    hideAffirmative,
    hideNegative,
    affirmativeText,
    negativeText,
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
    <div className={css.container}>
      <div className={classes}>
        <div className={css.actionErrors}>
          {acceptErrorMessage}
          {declineErrorMessage}
        </div>
        <div className={css.actionButtonWrapper}>
          {!hideAffirmative && (
            <PrimaryButton
              className={css.affirmativeAction}
              inProgress={affirmativeInProgress}
              disabled={buttonsDisabled}
              onClick={affirmativeAction}
            >
              {affirmativeText || <FormattedMessage id="TransactionPanel.acceptButton" />}
            </PrimaryButton>
          )}
          {!hideNegative && (
            <SecondaryButton
              className={css.negativeAction}
              inProgress={negativeInProgress}
              disabled={buttonsDisabled}
              onClick={negativeAction}
            >
              {negativeText || <FormattedMessage id="TransactionPanel.declineButton" />}
            </SecondaryButton>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default ActionButtons;
