import React, { useState } from 'react';
import { usePopper } from 'react-popper';

import css from './Dropdown.module.css';
import classNames from 'classnames';
import OutsideClickHandler from '../OutsideClickHandler/OutsideClickHandler';

const DropdownButton = ({
  buttonText,
  options,
  rootClassName,
  className,
  buttonClassName,
  buttonActiveClassName,
  listClassName,
  listItemClassName,
  reverse,
}) => {
  const [dropdownOpen, setDropdownToggle] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'flip',
        options: {

        },
      },
      {
        name: 'preventOverflow',
        options: {
          mainAxis: false,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, -30],
        },
      },
    ],
  });

  const dropdownToggle = () => {
    setDropdownToggle(!dropdownOpen);
    if (dropdownOpen) {
      referenceElement.blur();
    }
  };

  const classes = classNames(rootClassName || css.root, className);

  const carret = dropdownOpen ? '▲' : '▼';
  const carretReverse = dropdownOpen ? '▼' : '▲';

  return (
    <div className={classes}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setDropdownToggle(false);
          referenceElement.blur();
        }}
      >
        <button
          onClick={dropdownToggle}
          className={classNames(css.button, {
            [buttonClassName]: !!buttonClassName,
            [css.buttonActive]: dropdownOpen,
            [buttonActiveClassName]: dropdownOpen && buttonActiveClassName,
          })}
          type="button"
          ref={setReferenceElement}
        >
          {buttonText}{' '}
          <span className={css.caret}>{reverse ? carretReverse : carret}</span>
        </button>

        {dropdownOpen && (
          <ul
            ref={setPopperElement}
            {...attributes.popper}
            style={styles.popper}
            className={classNames(css.list, listClassName)}
          >
            {options.map(item => {
              return (
                <li
                  className={classNames(css.listItem, listItemClassName)}
                  key={item.name}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        )}
      </OutsideClickHandler>
    </div>
  );
};

export default DropdownButton;
