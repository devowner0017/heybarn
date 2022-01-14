import React, { useState } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { PrimaryButton, SecondaryButton } from '..';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

import css from './TransactionPanel.module.css';
import { cancelAfterAgreementSent } from '../../containers/TransactionPage/TransactionPage.duck';

// Functional component as a helper to build ActionButtons for
// provider when state is preauthorized
const StripeActionsMaybe = props => {
  const {
    className,
    rootClassName,
    showButtons,
    title,
cancelAgreement,
extendAgreement,
    extendSubscriptionInProgress,
    cancelSubscriptionInProgress,
    cancelSubscriptionError,
    extendSubscriptionError,
    onManageDisableScrolling,
  } = props;
  console.log('🚀 | file: StripeActionsMaybe.js | line 27 | props', props);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const buttonsDisabled = extendSubscriptionInProgress || cancelSubscriptionInProgress;
  const acceptErrorMessage = extendSubscriptionError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.acceptSaleFailed" />
    </p>
  ) : null;
  const declineErrorMessage = cancelSubscriptionError ? (
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
        <SecondaryButton
          inProgress={cancelSubscriptionInProgress}
          disabled={buttonsDisabled}
          onClick={_ => setShowCancelModal(true)}
        >
          {<FormattedMessage id="TransactionPanel.stripeCancelButton" />}
        </SecondaryButton>
        <PrimaryButton
          inProgress={extendSubscriptionInProgress}
          disabled={buttonsDisabled}
          onClick={_ => setShowExtendModal(true)}
        >
          {<FormattedMessage id="TransactionPanel.stripeExtendButton" />}
        </PrimaryButton>
      </div>
      <ConfirmationModal
        id="StripeCancelModal"
        isOpen={showCancelModal}
        onCloseModal={() => setShowCancelModal(false)}
        onManageDisableScrolling={onManageDisableScrolling}
        negativeAction={cancelAgreement}
        affirmativeButtonText={'Nevermind!'}
        negativeButtonText={'End Agreement'}
        affirmativeInProgress={cancelSubscriptionInProgress}
        // negativeInProgress={declineCommunicationInProgress}
        // affirmativeError={acceptCommunicationError}
        // negativeError={declineCommunicationError}
        titleText={<FormattedMessage id="TransactionPanel.stripeEndConfirmationTitle" />}
        contentText={<FormattedMessage id="TransactionPanel.stripeEndConfirmationSubTitle" />}
      />
      <ConfirmationModal
        id="StripeExtendModal"
        isOpen={showExtendModal}
        onCloseModal={() => setShowExtendModal(false)}
        onManageDisableScrolling={onManageDisableScrolling}
        AffirmativeAction={extendAgreement}
        affirmativeButtonText={'Confirm'}
        negativeButtonText={'Nevermind'}
        affirmativeInProgress={extendSubscriptionInProgress}
        // negativeInProgress={declineCommunicationInProgress}
        // affirmativeError={acceptCommunicationError}
        // negativeError={declineCommunicationError}
        titleText={<FormattedMessage id="TransactionPanel.stripeExtendConfirmationTitle" />}
        contentText={<FormattedMessage id="TransactionPanel.stripeExtendConfirmationSubTitle" />}
      />
    </div>
  ) : null;
};

export default StripeActionsMaybe;
