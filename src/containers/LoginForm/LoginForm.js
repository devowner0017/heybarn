import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { reduxForm, propTypes as formPropTypes } from 'redux-form';
import classNames from 'classnames';
import { PrimaryButton, TextInputField, NamedLink } from '../../components';
import * as validators from '../../util/validators';

import css from './LoginForm.css';

const LoginFormComponent = props => {
  const {
    rootClassName,
    className,
    form,
    handleSubmit,
    submitting,
    inProgress,
    intl,
    invalid,
  } = props;

  // email
  const emailLabel = intl.formatMessage({
    id: 'LoginForm.emailLabel',
  });
  const emailPlaceholder = intl.formatMessage({
    id: 'LoginForm.emailPlaceholder',
  });
  const emailRequiredMessage = intl.formatMessage({
    id: 'LoginForm.emailRequired',
  });
  const emailRequired = validators.required(emailRequiredMessage);

  // password
  const passwordLabel = intl.formatMessage({
    id: 'LoginForm.passwordLabel',
  });
  const passwordPlaceholder = intl.formatMessage({
    id: 'LoginForm.passwordPlaceholder',
  });
  const passwordRequiredMessage = intl.formatMessage({
    id: 'LoginForm.passwordRequired',
  });
  const passwordRequired = validators.required(passwordRequiredMessage);

  const classes = classNames(rootClassName || css.root, className);
  const submitDisabled = invalid || submitting || inProgress;

  const passwordRecoveryLink = (
    <NamedLink name="PasswordRecoveryPage" className={css.recoveryLink}>
      <FormattedMessage id="LoginForm.forgotPassword" />
    </NamedLink>
  );

  return (
    <form className={classes} onSubmit={handleSubmit}>

      <div>
        <TextInputField
          type="email"
          name="email"
          id={`${form}.email`}
          label={emailLabel}
          placeholder={emailPlaceholder}
          validate={emailRequired}
        />
        <TextInputField
          className={css.password}
          type="password"
          name="password"
          id={`${form}.password`}
          label={passwordLabel}
          placeholder={passwordPlaceholder}
          validate={passwordRequired}
        />
      </div>
      <div className={css.bottomWrapper}>
        <p className={css.bottomWrapperText}>
          <span className={css.recoveryLinkInfo}>
            <FormattedMessage id="LoginForm.forgotPasswordInfo" values={{ passwordRecoveryLink }} />
          </span>
        </p>
        <PrimaryButton className={css.submitButton} type="submit" disabled={submitDisabled}>
          <FormattedMessage id="LoginForm.logIn" />
        </PrimaryButton>
      </div>
    </form>
  );
};

LoginFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  inProgress: false,
};

const { string, bool } = PropTypes;

LoginFormComponent.propTypes = {
  ...formPropTypes,
  rootClassName: string,
  className: string,
  inProgress: bool,
  intl: intlShape.isRequired,
};

const defaultFormName = 'LoginForm';

const LoginForm = compose(reduxForm({ form: defaultFormName }), injectIntl)(LoginFormComponent);

export default LoginForm;
