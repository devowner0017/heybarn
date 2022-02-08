import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconComputer.module.css';

const IconComputer = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={classes} viewBox="0 0 615.68 639.44" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-36.56 -23.317)">
        <path
          d="m380.54 33.317c-39.027-0.1137-77.993 14.928-108.21 45.15-10.984 10.985-25.467 30.708-29.203 39.768-1.3459 3.2641-2.3705 4.1583-3.959 3.4609-22.554-9.9014-47.562-9.5869-68.252 0.85742-20.75
                10.475-39.144 34.4-43.242 56.244-0.79495 4.2375-1.6287 5.0195-7.7695 7.291-11.647 4.3081-26.042 13.589-36.529 23.551-16.688 15.852-26.579 31.88-33.201 53.797-3.1149 10.309-3.5527 14.07-3.6055 31.062-0.0499 16.048 0.45623 21.259 2.9785 30.666 9.8421 36.707 35.253 66.487 67.672 81.367v149.86l3.0938 7.6621c5.3719 13.303 17.174 24.213 32.166 29.736 3.8179 1.4065 40.929 1.7661 190.83 1.8418 202.64 0.10229 193.08 0.43725 205.2-7.2109 7.5467-4.764 16.918-16.036 20.309-24.428l3.0703-7.6016v-146.77c14.961-6.205 28.514-15.338 39.211-26.641 9.6544-10.201 15.06-18.235 21.252-31.592 7.7907-16.806 9.8984-26.795 9.8984-46.896 0-21.097-2.1743-30.635-11.246-49.334-11.169-23.023-26.255-38.341-48.641-49.393-13.631-6.7291-23.723-9.6314-37.666-10.832l-9.668-0.83399v-10.295c0-36.937-17.115-75.975-45.91-104.71-30.459-30.399-69.545-45.668-108.57-45.781zm-0.84961 21.961c19.514-0.02354 24.243 0.39848 34 3.0332 30.758 8.3057 58.179 27.303 76.291 52.854 17.503 24.691 23.709 46.139 23.709 81.949v21.049l19 0.66211c15.718 0.5486 20.658 1.242 28.602 4.0137 36.343 12.681 60.474 47.031 60.375 85.938-0.0873 34.109-20.485 65.252-49.785 80.504v-62.221l-3.0703-7.6016c-3.3985-8.411-12.767-19.666-20.355-24.457-12.124-7.6538-2.6082-7.3332-206.63-6.9551l-187.28 0.34765-8.377 3.8672c-10.638 4.9126-21.481 16.277-25.844 27.086l-3.1133 7.7129v59.055c-39.773-23.65-60.33-73.731-44.355-119.67 4.8751-14.018 10.884-23.288 22.854-35.258 12.161-12.161 21.152-17.914 37.732-24.143l11.576-4.3477 2.3223-11.102c4.66-22.279 16.172-37.919 34.621-47.037 17.753-8.7739 32.923-8.05 55.508 2.6484 6.9148 3.2755 12.72 5.9551 12.9 5.9551s3.6729-6.8276 7.7617-15.172c18.871-38.511 47.062-62.853 86.887-75.021 11.057-3.3784 13.782-3.6682 34.668-3.6934zm-34.91 271.12c173.35 0 180.78 0.0981 182.9 2.4375 2.0153 2.2269 2.2051 11.862 2.2051 111.13 0 103.6-0.11328 108.79-2.4375 110.89-2.2436 2.0305-16.866 2.207-183.13 2.207-173.35 0-180.78-0.0981-182.89-2.4375-2.0153-2.2269-2.207-11.862-2.207-111.13 1e-5 -103.6 0.11524-108.79 2.4395-110.89 2.2436-2.0305 16.864-2.207 183.12-2.207zm-270.7 284.67-3.6836 2.75c-7.7765 5.806-11.481 15.219-9.3438 23.734 1.1661 4.646 7.2759 11.54 12.098 13.648 3.3517 1.4656 51.311 1.7257 272.97 1.4883l268.9-0.28711 3.6816-2.75c6.2644-4.6772 8.9166-9.3755 9.5176-16.861 0.62952-7.8419-2.2411-13.603-9.4356-18.934l-3.7637-2.7891h-270.47z"
          style={{strokeWidth:1.3333}}
        />
      </g>
    </svg>
  );
};

const { string } = PropTypes;

IconComputer.defaultProps = {
  className: null,
  rootClassName: null,
};

IconComputer.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconComputer;