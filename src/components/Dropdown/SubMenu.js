import React, { useState } from 'react';
import { Popper } from 'react-popper';

const modifiers = {
  preventOverflow: {
    padding: 0,
  },
  shift: {
    enabled: true,
  },
  flip: {
    enabled: true,
    // flipVariationsByContent: true,
    behavior: 'flip',
  },
};

const SubMenu = ({ options, listRef, open }) => {
  return (
    <>
      {open ? (
        <Popper placement="left-start" modifiers={modifiers} referenceElement={listRef.current}>
          {({ ref, style, placement, arrowProps }) => (
            <ul
              ref={ref}
              style={style}
              data-placement={placement}
              className="dropdown-button__sub-list"
            >
              {options.map(item => (
                <li
                  className={`dropdown-button__list-item
                ${(item.name && `dropdown-button__list-item--${item.name}`) || ''}`}
                  key={item.name}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </Popper>
      ) : null}
    </>
  );
};

export default SubMenu;
