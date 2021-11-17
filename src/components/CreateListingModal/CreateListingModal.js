import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { IconReviewUser, Modal } from '..';
import { ReviewForm } from '../../forms';

import css from './CreateListingModal.module.css';

const CreateListingModal = props => {
  const {
    className,
    rootClassName,
    id,
    intl,
    isOpen,
    onCloseModal,
    onManageDisableScrolling,
    onSubmitReview,
    revieweeName,
    reviewSent,
    sendReviewInProgress,
    sendReviewError,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const closeButtonMessage = intl.formatMessage({ id: 'CreateListingModal.later' });
  const reviewee = <span className={css.reviewee}>{revieweeName}</span>;

  return (
    <Modal
      id={id}
      containerClassName={classes}
      contentClassName={css.modalContent}
      isOpen={isOpen}
      onClose={_ => null}
      onManageDisableScrolling={onManageDisableScrolling}
      usePortal
      closeButtonMessage={closeButtonMessage}
      hideCloseButton
    >
      <IconReviewUser className={css.modalIcon} />
      <p className={css.modalTitle}>
        <FormattedMessage id="CreateListingModal.title" values={{ revieweeName: reviewee }} />
      </p>
      <p className={css.modalMessage}>
        <FormattedMessage id="CreateListingModal.description" />
      </p>
      <ReviewForm
        onSubmit={onSubmitReview}
        reviewSent={reviewSent}
        sendReviewInProgress={sendReviewInProgress}
        sendReviewError={sendReviewError}
      />
    </Modal>
  );
};

const { bool, string } = PropTypes;

CreateListingModal.defaultProps = {
  className: null,
  rootClassName: null,
  reviewSent: false,
  sendReviewInProgress: false,
  sendReviewError: null,
};

CreateListingModal.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  reviewSent: bool,
  sendReviewInProgress: bool,
  sendReviewError: propTypes.error,
};

export default injectIntl(CreateListingModal);
