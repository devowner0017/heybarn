import React, { Component, PropTypes } from 'react'; // eslint-disable-line react/no-deprecated
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { NotFoundPage } from './containers';
import { NamedRedirect } from './components';
import * as propTypes from './util/propTypes';
import * as log from './util/log';

const { arrayOf, bool, object, func, shape, string } = PropTypes;

const canShowComponent = props => {
  const { isAuthenticated, route } = props;
  const { auth } = route;
  return !auth || isAuthenticated;
};

const callLoadData = props => {
  const { match, location, route, dispatch, logoutInProgress } = props;
  const { loadData, name } = route;
  const shouldLoadData =
    typeof loadData === 'function' && canShowComponent(props) && !logoutInProgress;

  if (shouldLoadData) {
    dispatch(loadData(match.params, location.search))
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(`loadData success for ${name} route`);
      })
      .catch(e => {
        log.error(e, 'load-data-failed', { routeName: name });
      });
  }
};

class RouteComponentRenderer extends Component {
  componentDidMount() {
    // Calling loadData on initial rendering (on client side).
    callLoadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // Calling loadData after initial rendering (on client side).
    // This makes it possible to use loadData as default client side data loading technique.
    // However it is better to fetch data before location change to avoid "Loading data" state.
    callLoadData(nextProps);
  }

  render() {
    const { route, match, location, staticContext } = this.props;
    const { component: RouteComponent, authPage = 'SignupPage' } = route;
    const canShow = canShowComponent(this.props);
    if (!canShow) {
      staticContext.unauthorized = true;
    }
    return canShow ? (
      <RouteComponent params={match.params} location={location} />
    ) : (
      <NamedRedirect
        name={authPage}
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }
}

RouteComponentRenderer.propTypes = {
  isAuthenticated: bool.isRequired, // eslint-disable-line react/no-unused-prop-types
  logoutInProgress: bool.isRequired, // eslint-disable-line react/no-unused-prop-types
  route: propTypes.route.isRequired,
  match: shape({
    params: object.isRequired,
    url: string.isRequired,
  }).isRequired,
  location: shape({
    search: string.isRequired,
  }).isRequired,
  staticContext: object.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: func.isRequired,
};

const Routes = (props, context) => {
  const { isAuthenticated, logoutInProgress, staticContext, dispatch, routes } = props;

  const toRouteComponent = route => {
    const renderProps = {
      isAuthenticated,
      logoutInProgress,
      route,
      staticContext,
      dispatch,
    };

    // By default, our routes are exact.
    // https://reacttraining.com/react-router/web/api/Route/exact-bool
    const isExact = route.exact != null ? route.exact : true;
    return (
      <Route
        key={route.name}
        path={route.path}
        exact={isExact}
        render={matchProps => (
          <RouteComponentRenderer
            {...renderProps}
            match={matchProps.match}
            location={matchProps.location}
          />
        )}
      />
    );
  };

  // N.B. routes prop within React Router needs to stay the same,
  // so that React is is not rerendering page component.
  // That's why we pass-in props.routes instead of calling routeConfiguration here.
  return (
    <Switch>
      {routes.map(toRouteComponent)}
      <Route component={NotFoundPage} />
    </Switch>
  );
};

Routes.defaultProps = { staticContext: {} };

Routes.propTypes = {
  isAuthenticated: bool.isRequired,
  logoutInProgress: bool.isRequired,
  routes: arrayOf(propTypes.route).isRequired,

  // from withRouter
  staticContext: object,

  // from connect
  dispatch: func.isRequired,
};

const mapStateToProps = state => {
  const { isAuthenticated, logoutInProgress } = state.Auth;
  return { isAuthenticated, logoutInProgress };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
export default compose(withRouter, connect(mapStateToProps))(Routes);
