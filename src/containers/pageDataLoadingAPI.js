/**
 * Export loadData calls from ducks modules of different containers
 */
import { setInitialValues as CheckoutPageInitialValues } from './CheckoutPage/CheckoutPage.duck';
import { loadData as LandingPageLoader } from './LandingPage/LandingPage.duck';
import { loadData as ContactDetailsPageLoader } from './ContactDetailsPage/ContactDetailsPage.duck';
import { loadData as EditListingPageLoader } from './EditListingPage/EditListingPage.duck';
import { loadData as EmailVerificationPageLoader } from './EmailVerificationPage/EmailVerificationPage.duck';
import { loadData as InboxPageLoader } from './InboxPage/InboxPage.duck';
import { loadData as ListingPageLoader } from './ListingPage/ListingPage.duck';
import { loadListingData as ManageListingsPageLoader } from './ManageListingsPage/ManageListingsPage.duck';
import { loadAdvertData as ManageAdvertsPageLoader } from './ManageListingsPage/ManageListingsPage.duck';
import { loadData as PaymentMethodsPageLoader } from './PaymentMethodsPage/PaymentMethodsPage.duck';
import { loadData as ProfilePageLoader } from './ProfilePage/ProfilePage.duck';
import { loadData as SearchPageLoader } from './SearchPage/SearchPage.duck';
import { loadData as StripePayoutPageLoader } from './StripePayoutPage/StripePayoutPage.duck';
import {
  loadData as TransactionPageLoader,
  setInitialValues as TransactionPageInitialValues,
} from './TransactionPage/TransactionPage.duck';
import {
  loadData as TransactionInitPageLoader,
  setInitialValues as TransactionInitPageInitialValues,
} from './TransactionInitPage/TransactionInitPage.duck';

const getPageDataLoadingAPI = () => {
  return {
    LandingPage: {
      loadData: LandingPageLoader,
    },
    CheckoutPage: {
      setInitialValues: CheckoutPageInitialValues,
    },
    ContactDetailsPage: {
      loadData: ContactDetailsPageLoader,
    },
    EditListingPage: {
      loadData: EditListingPageLoader,
    },
    EmailVerificationPage: {
      loadData: EmailVerificationPageLoader,
    },
    InboxPage: {
      loadData: InboxPageLoader,
    },
    ListingPage: {
      loadData: ListingPageLoader,
    },
    ManageListingsPage: {
      loadListingData: ManageListingsPageLoader,
      loadAdvertData: ManageAdvertsPageLoader,
    },
    PaymentMethodsPage: {
      loadData: PaymentMethodsPageLoader,
    },
    ProfilePage: {
      loadData: ProfilePageLoader,
    },
    SearchPage: {
      loadData: SearchPageLoader,
    },
    StripePayoutPage: {
      loadData: StripePayoutPageLoader,
    },
    TransactionPage: {
      loadData: TransactionPageLoader,
      setInitialValues: TransactionPageInitialValues,
    },
    TransactionInitPage: {
      loadData: TransactionInitPageLoader,
      setInitialValues: TransactionInitPageInitialValues,
    },
  };
};

export default getPageDataLoadingAPI;
