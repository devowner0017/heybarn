import { LOCATION_CHANGED } from '../ducks/Routing.duck';
import { CURRENT_USER_SHOW_SUCCESS } from '../ducks/user.duck';

// Create a Redux middleware from the given analytics handlers. Each
// handler should have the following methods:
//
// - trackPageView(url): called when the URL is changed
export const createMiddleware = handlers => () => next => action => {
  const { type, payload } = action;

  if (type === LOCATION_CHANGED) {
    const { canonicalUrl } = payload;
    handlers.forEach(handler => {
      handler.trackPageView(canonicalUrl);
    });
  }

  if (type === CURRENT_USER_SHOW_SUCCESS) {
    const { id, attributes } = payload || {};

    const formattedUser = {
      id: id?.uuid,
      email: attributes?.email,
      name: attributes?.profile?.displayName,
    };

    handlers.forEach(handler => {
      handler.identifyUser(formattedUser);
    });
  }

  next(action);
};
