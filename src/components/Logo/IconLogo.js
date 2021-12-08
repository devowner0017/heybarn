import React from 'react';
import PropTypes from 'prop-types';

const IconLogo = props => {
  const { className, ...rest } = props;

  return (
    <svg
      className={className}
      {...rest}
      viewBox="0 0 145.2 94.144"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(4.6637 0 0 4.6637 -148.76 -432.36)">
        <g transform="matrix(.35278 0 0 -.35278 56.629 97.65)">
          <path d="m0 0-3.671 1.997v-19.028h3.671z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 52.37 95.333)">
          <path d="m0 0-2.507 1.364-1.163-0.634v-24.329h3.67z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 54.5 96.492)">
          <path d="m0 0-3.67 1.997v-22.312h3.67z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 59.593 110.75)">
          <path d="m0 0h3.67v30.563l-3.67 1.997z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 44.688 110.75)">
          <path d="m0 0h3.671v36.575l-3.671-1.997z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 57.463 110.75)">
          <path d="m0 0h3.67v33.847l-3.67 1.997z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 42.558 110.75)">
          <path d="m0 0h3.67v33.291l-3.67-1.997z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 36.17 110.75)">
          <path d="m0 0h3.671v27.554l-3.671-0.729z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 38.3 110.75)">
          <path d="m0 0h3.671v28.753l-3.671-0.729z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 40.429 100.44)">
          <path d="m0 0v-29.222h3.67v30.007l-0.161-0.088z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 34.041 110.75)">
          <path d="m0 0h3.67v26.355l-3.67-0.729z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 48.946 110.75)">
          <path d="m0 0h3.671v43.143l-3.671-1.997z" />
        </g>
        <g transform="matrix(.35278 0 0 -.35278 46.817 110.75)">
          <path d="m0 0h3.67v39.859l-3.67-1.997z" />
        </g>
      </g>
    </svg>
  );
};

const { string } = PropTypes;

IconLogo.defaultProps = {
  className: null,
};

IconLogo.propTypes = {
  className: string,
};

export default IconLogo;
