import React, { Component, PropTypes } from 'react';
import { Link, Redirect } from 'react-router';
import { PageLayout } from '../../components';
import { fakeAuth } from '../../Routes';

class AuthenticationPage extends Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferrer: false };

    this.login = this.login.bind(this);
  }

  login() {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  }

  render() {
    const from = this.props.location.state && this.props.location.state.from
      ? this.props.location.state.from
      : '/';
    const { redirectToReferrer } = this.state;

    const toLogin = <Link to={{ pathname: '/login', state: { from: from || '/' } }}>Log in</Link>;
    const toSignup = (
      <Link to={{ pathname: '/signup', state: { from: from || '/' } }}>Sign up</Link>
    );
    const alternativeMethod = this.props.tab === 'login' ? toSignup : toLogin;
    const currentMethod = this.props.tab === 'login' ? 'Log in' : 'Sign up';

    const fromLoginMsg = from ? (
        <p>
          You must log in to view the page at
          <code>{from.pathname}</code>
        </p>
      ) : null;

    return (
      <PageLayout title={`Authentication page: ${this.props.tab} tab`}>
        {redirectToReferrer ? <Redirect to={from || '/'} /> : null}
        {fromLoginMsg}
        <button onClick={this.login}>{currentMethod}</button>
        <p>or {alternativeMethod}</p>
      </PageLayout>
    );
  }
}

AuthenticationPage.defaultProps = { location: {}, tab: 'signup' };

const { any, oneOf, shape } = PropTypes;

AuthenticationPage.propTypes = {
  location: shape({ state: shape({ from: any }) }),
  tab: oneOf([ 'login', 'signup' ]),
};

export default AuthenticationPage;
