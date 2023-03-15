import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { PrimaryButton, SecondaryButton, Modal } from '..';

import css from './ConfirmationModal.module.css';

const ConfirmationModal = props => {
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
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const closeButtonMessage = closeText || intl.formatMessage({ id: 'ConfirmationModal.later' });

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
            {titleText || <FormattedMessage id="ConfirmationModal.defaultTitle" />}
          </p>
          <p className={css.modalMessage}>
            {contentText || <FormattedMessage id="ConfirmationModal.defaultSubTitle" />}
          </p>
        </div>
        <div className={css.actionButtonWrapper}>
          {!hideAffirmative && (
            <PrimaryButton
              inProgress={affirmativeInProgress}
              disabled={buttonsDisabled}
              onClick={val => {
                !!affirmativeAction ? affirmativeAction(val) : onCloseModal(false);
                onCloseModal(false);
              }}
            >
              {affirmativeButtonText || <FormattedMessage id="TransactionPanel.acceptButton" />}
            </PrimaryButton>
          )}
          {!hideNegative && (
            <SecondaryButton
              inProgress={negativeInProgress}
              disabled={buttonsDisabled}
              onClick={val => {
                !!negativeAction ? negativeAction(val) : onCloseModal(false);
                onCloseModal(false);
              }}
            >
              {negativeButtonText || <FormattedMessage id="TransactionPanel.declineButton" />}
            </SecondaryButton>
          )}
        </div>
        <div className={css.actionErrors}>
          {acceptErrorMessage}
          {declineErrorMessage}
        </div>
      </div>
    </Modal>
  );
};

const { bool, string } = PropTypes;

ConfirmationModal.defaultProps = {
  className: null,
  rootClassName: null,
  reviewSent: false,
  sendReviewInProgress: false,
  sendReviewError: null,
};

ConfirmationModal.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  reviewSent: bool,
  sendReviewInProgress: bool,
  sendReviewError: propTypes.error,
};

export default injectIntl(ConfirmationModal);
