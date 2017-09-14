import { clearCurrentUser, fetchCurrentUser } from './user.duck';

const authenticated = authInfo => authInfo.grantType === 'refresh_token';

// ================ Action types ================ //

export const AUTH_INFO_REQUEST = 'app/Auth/AUTH_INFO_REQUEST';
export const AUTH_INFO_SUCCESS = 'app/Auth/AUTH_INFO_SUCCESS';
export const AUTH_INFO_ERROR = 'app/Auth/AUTH_INFO_ERROR';

export const LOGIN_REQUEST = 'app/Auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'app/Auth/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'app/Auth/LOGIN_ERROR';

export const LOGOUT_REQUEST = 'app/Auth/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'app/Auth/LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'app/Auth/LOGOUT_ERROR';

export const SIGNUP_REQUEST = 'app/Auth/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'app/Auth/SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'app/Auth/SIGNUP_ERROR';

// Generic user_logout action that can be handled elsewhere
// E.g. src/reducers.js clears store as a consequence
export const USER_LOGOUT = 'app/USER_LOGOUT';

// ================ Reducer ================ //

const initialState = {
  isAuthenticated: false,

  // auth info
  authInfoLoaded: false,
  authInfoError: null,

  // login
  loginError: null,
  loginInProgress: false,

  // logout
  logoutError: null,
  logoutInProgress: false,

  // signup
  signupError: null,
  signupInProgress: false,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case AUTH_INFO_REQUEST:
      return { ...state, authInfoError: null };
    case AUTH_INFO_SUCCESS:
      return { ...state, authInfoLoaded: true, isAuthenticated: authenticated(payload) };
    case AUTH_INFO_ERROR:
      console.error(payload); // eslint-disable-line
      return { ...state, authInfoLoaded: true, authInfoError: payload };

    case LOGIN_REQUEST:
      return {
        ...state,
        loginInProgress: true,
        loginError: null,
        logoutError: null,
        signupError: null,
      };
    case LOGIN_SUCCESS:
      return { ...state, loginInProgress: false, isAuthenticated: true };
    case LOGIN_ERROR:
      return { ...state, loginInProgress: false, loginError: payload };

    case LOGOUT_REQUEST:
      return { ...state, logoutInProgress: true, loginError: null, logoutError: null };
    case LOGOUT_SUCCESS:
      return { ...state, logoutInProgress: false, isAuthenticated: false };
    case LOGOUT_ERROR:
      return { ...state, logoutInProgress: false, logoutError: payload };

    case SIGNUP_REQUEST:
      return { ...state, signupInProgress: true, loginError: null, signupError: null };
    case SIGNUP_SUCCESS:
      return { ...state, signupInProgress: false };
    case SIGNUP_ERROR:
      return { ...state, signupInProgress: false, signupError: payload };

    default:
      return state;
  }
}

// ================ Selectors ================ //

export const authenticationInProgress = state => {
  const { loginInProgress, logoutInProgress, signupInProgress } = state.Auth;
  return loginInProgress || logoutInProgress || signupInProgress;
};

// ================ Action creators ================ //

export const authInfoRequest = () => ({ type: AUTH_INFO_REQUEST });
export const authInfoSuccess = info => ({ type: AUTH_INFO_SUCCESS, payload: info });
export const authInfoError = error => ({ type: AUTH_INFO_ERROR, payload: error, error: true });

export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = () => ({ type: LOGIN_SUCCESS });
export const loginError = error => ({ type: LOGIN_ERROR, payload: error, error: true });

export const logoutRequest = () => ({ type: LOGOUT_REQUEST });
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });
export const logoutError = error => ({ type: LOGOUT_ERROR, payload: error, error: true });

export const signupRequest = () => ({ type: SIGNUP_REQUEST });
export const signupSuccess = () => ({ type: SIGNUP_SUCCESS });
export const signupError = error => ({ type: SIGNUP_ERROR, payload: error, error: true });

export const userLogout = () => ({ type: USER_LOGOUT });

// ================ Thunks ================ //

export const authInfo = () =>
  (dispatch, getState, sdk) => {
    dispatch(authInfoRequest());
    return sdk
      .authInfo()
      .then(info => dispatch(authInfoSuccess(info)))
      .catch(e => dispatch(authInfoError(e)));
  };

export const login = (username, password) =>
  (dispatch, getState, sdk) => {
    if (authenticationInProgress(getState())) {
      return Promise.reject(new Error('Login or logout already in progress'));
    }
    dispatch(loginRequest());

    // Note that the thunk does not reject when the login fails, it
    // just dispatches the login error action.
    return sdk
      .login({ username, password })
      .then(() => dispatch(loginSuccess()))
      .then(() => dispatch(fetchCurrentUser()))
      .catch(e => dispatch(loginError(e)));
  };

export const logout = () =>
  (dispatch, getState, sdk) => {
    if (authenticationInProgress(getState())) {
      return Promise.reject(new Error('Login or logout already in progress'));
    }
    dispatch(logoutRequest());

    // Not that the thunk does not reject when the logout fails, it
    // just dispatches the logout error action.
    return sdk
      .logout()
      .then(() => dispatch(clearCurrentUser()))
      .then(() => dispatch(logoutSuccess()))
      .then(() => dispatch(userLogout()))
      .catch(e => dispatch(logoutError(e)));
  };

export const signup = params =>
  (dispatch, getState, sdk) => {
    if (authenticationInProgress(getState())) {
      return Promise.reject(new Error('Login or logout already in progress'));
    }
    dispatch(signupRequest());
    const { email, password } = params;

    // We must login the user if signup succeeds since the API doesn't
    // do that automatically.
    return sdk.currentUser
      .create(params)
      .then(() => dispatch(signupSuccess()))
      .then(() => dispatch(login(email, password)))
      .catch(e => dispatch(signupError(e)));
  };
