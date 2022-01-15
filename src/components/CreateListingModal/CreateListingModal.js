import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { IconReviewUser, Modal, ActionButtons, NamedRedirect } from '..';
import { ReviewForm } from '../../forms';

import css from './CreateListingModal.module.css';
import { useHistory } from 'react-router';
import { capitalize } from 'lodash';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString, findRouteByRouteName } from '../../util/routes';

const CreateListingModal = props => {
  const {
    className,
    rootClassName,
    id,
    intl,
    isOpen,
    onManageDisableScrolling,
    listingType,
    authorName,
  } = props;
    console.log("🚀 | file: CreateListingModal.js | line 26 | listingType", listingType);
  const history = useHistory();

  const classes = classNames(rootClassName || css.root, className);
  const closeButtonMessage = intl.formatMessage({ id: 'CreateListingModal.later' });
  const handleRedirect = () => {
    const routes = routeConfiguration();
    history.push(createResourceLocatorString(`New${listingType === 'listing' ? "Advert" : "Listing"}Page`, routes, {}, {}));
  };
  const handleBack = () => {
    history.goBack();
  };

  const completeButtons = (
    <ActionButtons
      showButtons={true}
      affirmativeAction={() => handleRedirect()}
      negativeAction={() => handleBack()}
      affirmativeText={'Lets do it!'}
      negativeText={'Keep browsing'}
    />
  );
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
      <p className={css.modalTitle}>
        <FormattedMessage
          id="CreateListingModal.title"
          values={{ listingType: listingType === 'listing' ? 'advert' : 'listing' }}
        />
      </p>
      <p className={css.modalMessage}>
        <FormattedMessage
          id="CreateListingModal.description"
          values={{
            listingType: listingType === 'listing' ? 'an advert' : 'a listing',
            name: authorName,
          }}
        />
      </p>
      {completeButtons}
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
