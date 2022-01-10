import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { RentalAgreementSetupForm } from '../../forms';
import { PrimaryButton, SecondaryButton, Modal } from '..';

import css from './RentalAgreementModal.module.css';
import { ensureArray, getPropByName } from '../../util/userHelpers';

const RentalAgreementModal = props => {
  const {
    className,
    rootClassName,
    id,
    intl,
    isOpen,
    onCloseModal,
    closeText,
    onManageDisableScrolling,
    affirmativeInProgress,
    negativeInProgress,
    affirmativeError,
    negativeError,
    affirmativeErrorText,
    negativeErrorText,
    affirmativeAction,
    negativeAction,
    hideAffirmative,
    hideNegative,
    affirmativeButtonText,
    negativeButtonText,
    titleText,
    contentText,
    listing,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const closeButtonMessage = closeText || intl.formatMessage({ id: 'RentalAgreementModal.later' });

  const buttonsDisabled = affirmativeInProgress || negativeInProgress;

  const acceptErrorMessage = affirmativeError ? (
    <p className={css.actionError}>
      {!!affirmativeErrorText ? (
        affirmativeErrorText
      ) : (
        <FormattedMessage id="TransactionPanel.acceptSaleFailed" />
      )}
    </p>
  ) : null;
  const declineErrorMessage = negativeError ? (
    <p className={css.actionError}>
      {!!negativeErrorText ? (
        negativeErrorText
      ) : (
        <FormattedMessage id="TransactionPanel.declineSaleFailed" />
      )}
    </p>
  ) : null;

  const handleSubmit = values => {
    affirmativeAction(values);
  };

  console.log('🚀 | file: RentalAgreementModal.js | line 90 | listing', listing);
  console.log(
    "🚀 | file: RentalAgreementModal.js | line 91 | ensureArray(getPropByName(listing,))?.join(', ')",
    ensureArray(getPropByName(listing, 'preferredUse'))?.join(', ')
  );
  return (
    <Modal
      id={id}
      containerClassName={classes}
      contentClassName={css.modalContent}
      isOpen={isOpen}
      onClose={onCloseModal}
      onManageDisableScrolling={onManageDisableScrolling}
      usePortal
      closeButtonMessage={closeButtonMessage}
    >
      <div className={css.modalWrapper}>
        <div className={css.contentWrapper}>
          <p className={css.modalTitle}>
            {titleText || <FormattedMessage id="RentalAgreementModal.defaultTitle" />}
          </p>
          <p className={css.modalMessage}>
            {contentText || <FormattedMessage id="RentalAgreementModal.defaultSubTitle" />}
          </p>
        </div>
        <RentalAgreementSetupForm
          onSubmit={handleSubmit}
          onCloseModal={onCloseModal}
          initialValues={{
            lengthOfContract: null,
            groundRules: getPropByName(listing, 'groundRules'),
            intendedUse: _.startCase(
              ensureArray(getPropByName(listing, 'preferredUse'))?.join(', ') || ''
            ),
          }}
          listing={listing}
        />
      </div>
    </Modal>
  );
};

const { bool, string } = PropTypes;

RentalAgreementModal.defaultProps = {
  className: null,
  rootClassName: null,
  reviewSent: false,
  sendReviewInProgress: false,
  sendReviewError: null,
};

RentalAgreementModal.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  reviewSent: bool,
  sendReviewInProgress: bool,
  sendReviewError: propTypes.error,
};

export default injectIntl(RentalAgreementModal);
