import React, { useState, useEffect } from 'react';
import { bool, func, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { ensureCurrentUser, ensureStripeCustomer, ensurePaymentMethodCard } from '../../util/data';
import { propTypes } from '../../util/types';
import { savePaymentMethod, deletePaymentMethod } from '../../ducks/paymentMethods.duck';
import { handleCardSetup } from '../../ducks/stripe.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import {
  SavedCardDetails,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperAccountSettingsSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  Page,
  UserNav,
} from '..';
import moment from 'moment';
import { TopbarContainer } from '../../containers';
import { PaymentMethodsForm } from '../../forms';
import {
  createStripeSetupIntent,
  stripeCustomer,
} from '../../containers/PaymentMethodsPage/PaymentMethodsPage.duck';

import css from './UpdatePaymentMethodsPanel.module.css';
import { createRecurring } from '../../containers/CheckoutPage/CheckoutPage.duck';
import { getPropByName } from '../../util/devHelpers';

const UpdatePaymentMethodsPanelComponent = props => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardState, setCardState] = useState(null);

  const {
    currentUser,
    addPaymentMethodError,
    deletePaymentMethodError,
    createStripeCustomerError,
    handleCardSetupError,
    deletePaymentMethodInProgress,
    onCreateSetupIntent,
    onHandleCardSetup,
    onSavePaymentMethod,
    onCreateRecurring,
    onDeletePaymentMethod,
    fetchStripeCustomer,
    scrollingDisabled,
    onManageDisableScrolling,
    intl,
    stripeCustomerFetched,
    onUpdate,
    onUpdateSubscriptionPaymentMethod,
    subscription,
    transaction,
  } = props;

  useEffect(() => {
    fetchStripeCustomer();
  }, []);

  const getClientSecret = setupIntent => {
    return setupIntent && setupIntent.attributes ? setupIntent.attributes.clientSecret : null;
  };

  const getPaymentParams = (currentUser, formValues) => {
    const { name, addressLine1, addressLine2, postal, state, city, country } = formValues;
    const addressMaybe =
      addressLine1 && postal
        ? {
            address: {
              city: city,
              country: country,
              line1: addressLine1,
              line2: addressLine2,
              postal_code: postal,
              state: state,
            },
          }
        : {};
    const billingDetails = {
      name,
      email: ensureCurrentUser(currentUser).attributes.email,
      ...addressMaybe,
    };

    const paymentParams = {
      payment_method_data: {
        billing_details: billingDetails,
      },
    };

    return paymentParams;
  };

  const createNewSubscription = data => {
    const {
      listing,
      provider,
      booking: { attributes: bookingDates },
    } = transaction;
    const createRecurringParams = {
      weeklyAmount: listing?.attributes?.price?.amount,
      listingId: listing?.id?.uuid,
      stripeCustomerId: currentUser?.stripeCustomer?.attributes?.stripeCustomerId,
      providerUserId: provider.id,
      paymentMethod: data,
      transactionId: transaction?.id?.uuid,
      lengthOfContract: getPropByName(transaction, 'lengthOfContract'),
      startTimestamp: moment(bookingDates.start)
        .add({ days: 6, hours: 23, minutes: 59 })
        .unix(),
      endTimestamp: moment(bookingDates.end)
        .subtract({ days: 6, hours: 23, minutes: 59 })
        .unix(),
      // transaction: tx,
      ongoingContract: getPropByName(transaction, 'ongoingContract'),
    };

    return onCreateRecurring({ ...createRecurringParams, paymentMethod: data })
      .then(recurringResponse => {
        return { ...rest, protectedData: { recurringResponse } };
      })
      .catch(e => {
      });
  };
  const handleSubmit = params => {
    setIsSubmitting(true);
    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const stripeCustomer = ensuredCurrentUser.stripeCustomer;
    const { stripe, card, formValues } = params;

    onCreateSetupIntent()
      .then(setupIntent => {
        const stripeParams = {
          stripe,
          card,
          setupIntentClientSecret: getClientSecret(setupIntent),
          paymentParams: getPaymentParams(currentUser, formValues),
        };

        return onHandleCardSetup(stripeParams);
      })
      .then(result => {
        const newPaymentMethod = result.setupIntent.payment_method;
        // Note: stripe.handleCardSetup might return an error inside successful call (200), but those are rejected in thunk functions.
        return onSavePaymentMethod(stripeCustomer, newPaymentMethod).then(r => {
          if (!subscription) {
            return createNewSubscription(newPaymentMethod).then((subResponse) => {
              return {...newPaymentMethod, subResponse};
            });
          } else {
            return newPaymentMethod;
          }
        });
      })
      .then(r => {
        // Update currentUser entity and its sub entities: stripeCustomer and defaultPaymentMethod
        fetchStripeCustomer();
        setIsSubmitting(false);
        onUpdateSubscriptionPaymentMethod(r);
        setCardState('default');
      })
      .catch(error => {
        console.error(error);
        setIsSubmitting(false);
      });
  };

  const handleRemovePaymentMethod = () => {
    onDeletePaymentMethod().then(() => {
      fetchStripeCustomer();
    });
  };

  const ensuredCurrentUser = ensureCurrentUser(currentUser);
  const currentUserLoaded = !!ensuredCurrentUser.id;

  const hasDefaultPaymentMethod =
    currentUser &&
    ensureStripeCustomer(currentUser.stripeCustomer).attributes.stripeCustomerId &&
    ensurePaymentMethodCard(currentUser.stripeCustomer.defaultPaymentMethod).id;

  // Get first and last name of the current user and use it in the StripePaymentForm to autofill the name field
  const userName = currentUserLoaded
    ? `${ensuredCurrentUser.attributes.profile.firstName} ${ensuredCurrentUser.attributes.profile.lastName}`
    : null;

  const initalValuesForStripePayment = { name: userName };

  const card = hasDefaultPaymentMethod
    ? ensurePaymentMethodCard(currentUser.stripeCustomer.defaultPaymentMethod).attributes.card
    : null;

  const showForm = true; //cardState === 'replaceCard' || !hasDefaultPaymentMethod;
  return (
    <div className={css.content}>
      {!stripeCustomerFetched ? null : (
        <>
          {showForm ? (
            <PaymentMethodsForm
              className={css.paymentForm}
              formId="PaymentMethodsForm"
              initialValues={initalValuesForStripePayment}
              onSubmit={handleSubmit}
              handleRemovePaymentMethod={handleRemovePaymentMethod}
              hasDefaultPaymentMethod={hasDefaultPaymentMethod}
              addPaymentMethodError={addPaymentMethodError}
              deletePaymentMethodError={deletePaymentMethodError}
              createStripeCustomerError={createStripeCustomerError}
              handleCardSetupError={handleCardSetupError}
              inProgress={isSubmitting}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

UpdatePaymentMethodsPanelComponent.defaultProps = {
  currentUser: null,
  addPaymentMethodError: null,
  deletePaymentMethodError: null,
  createStripeCustomerError: null,
  handleCardSetupError: null,
};

UpdatePaymentMethodsPanelComponent.propTypes = {
  currentUser: propTypes.currentUser,
  scrollingDisabled: bool.isRequired,
  addPaymentMethodError: object,
  deletePaymentMethodError: object,
  createStripeCustomerError: object,
  handleCardSetupError: object,
  onCreateSetupIntent: func.isRequired,
  onHandleCardSetup: func.isRequired,
  onSavePaymentMethod: func.isRequired,
  onDeletePaymentMethod: func.isRequired,
  fetchStripeCustomer: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;

  const {
    deletePaymentMethodInProgress,
    addPaymentMethodError,
    deletePaymentMethodError,
    createStripeCustomerError,
  } = state.paymentMethods;

  const { stripeCustomerFetched } = state.PaymentMethodsPage;

  const { handleCardSetupError } = state.stripe;
  return {
    currentUser,
    scrollingDisabled: isScrollingDisabled(state),
    deletePaymentMethodInProgress,
    addPaymentMethodError,
    deletePaymentMethodError,
    createStripeCustomerError,
    handleCardSetupError,
    stripeCustomerFetched,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  fetchStripeCustomer: () => dispatch(stripeCustomer()),
  onHandleCardSetup: params => dispatch(handleCardSetup(params)),
  onCreateSetupIntent: params => dispatch(createStripeSetupIntent(params)),
  onSavePaymentMethod: (stripeCustomer, newPaymentMethod) =>
    dispatch(savePaymentMethod(stripeCustomer, newPaymentMethod)),
  onDeletePaymentMethod: params => dispatch(deletePaymentMethod(params)),
  onCreateRecurring: params => dispatch(createRecurring(params)),
});

const UpdatePaymentMethodsPanel = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(UpdatePaymentMethodsPanelComponent);

export default UpdatePaymentMethodsPanel;
