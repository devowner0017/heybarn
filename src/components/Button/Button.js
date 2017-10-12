import React, { PropTypes, Component } from 'react'; // eslint-disable-line react/no-deprecated
import classNames from 'classnames';
import { IconSpinner, IconCheckmark } from '../../components';

import css from './Button.css';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { mounted: false };
  }
  componentDidMount() {
    this.setState({ mounted: true }); // eslint-disable-line react/no-did-mount-set-state
  }
  render() {
    const { children, className, rootClassName, inProgress, ready, disabled, ...rest } = this.props;

    const rootClass = rootClassName || css.root;
    const classes = classNames(rootClass, className, {
      [css.ready]: ready,
      [css.inProgress]: inProgress,
    });

    let content;

    if (inProgress) {
      content = <IconSpinner rootClassName={css.spinner} />;
    } else if (ready) {
      content = <IconCheckmark rootClassName={css.checkmark} />;
    } else {
      content = children;
    }

    // All buttons are disabled until the component is mounted. This
    // prevents e.g. being able to submit forms to the backend before
    // the client side is handling the submit.
    const buttonDisabled = this.state.mounted ? disabled : true;

    return <button className={classes} {...rest} disabled={buttonDisabled}>{content}</button>;
  }
}

const { node, string, bool } = PropTypes;

Button.defaultProps = {
  rootClassName: null,
  className: null,
  inProgress: false,
  ready: false,
  disabled: false,
  children: null,
};

Button.propTypes = {
  rootClassName: string,
  className: string,

  inProgress: bool,
  ready: bool,
  disabled: bool,

  children: node,
};

export default Button;

export const PrimaryButton = props => <Button {...props} rootClassName={css.primaryButton} />;
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = props => <Button {...props} rootClassName={css.secondaryButton} />;
SecondaryButton.displayName = 'SecondaryButton';

export const InlineTextButton = props => <Button {...props} rootClassName={css.inlineTextButton} />;
InlineTextButton.displayName = 'InlineTextButton';
