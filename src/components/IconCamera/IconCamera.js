import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconCamera.module.css';

const IconCamera = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={classes} viewBox="0 0 675.42 584.26" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-2576.3 -2127.1)">
        <path
          d="m2664.4 2701.2c-23.996-1.1086-46.323-12.748-61.069-31.835-9.9766-12.914-15.848-28.629-16.86-45.127-0.2243-3.6566-0.2243-324.47 0-328.13 0.6728-10.968 3.4673-21.565 8.2506-31.285 2.9934-6.0828 6.9072-12.016 11.4-17.283 1.9687-2.3078 6.9823-7.262 9.3066-9.1964 12.829-10.677 27.606-17.009 43.892-18.808 4.6011-0.5082 9.1809-0.5536 56.221-0.5571h47.381l23.613-35.419c14.25-21.376 24.105-36.006 24.854-36.898 4.4824-5.3425 11.318-8.8224 18.558-9.4468 2.6717-0.2304 165.52-0.2304 168.19 0 3.597 0.3103 6.9078 1.2341 10.042 2.8022 3.1091 1.5553 5.98 3.743 8.1499 6.2105 0.9419 1.0711 7.6174 10.956 25.054 37.1l23.77 35.64 49.705 0.056c54.503 0.061 51.125 0 57.607 1.004 30.512 4.7155 55.902 26.42 65.366 55.877 1.8565 5.7782 2.986 11.354 3.6558 18.046 0.3082 3.0789 0.3082 329.37 0 332.45-0.6632 6.6266-1.8177 12.335-3.641 18.003-9.4937 29.512-34.838 51.19-65.381 55.92-1.4626 0.2265-3.839 0.5348-5.2808 0.6851-2.4591 0.2562-18.055 0.2745-251.38 0.2948-136.82 0.012-249.95-0.033-251.4-0.1003zm500.77-55.006c11.186-2.3777 20.585-10.838 21.602-22.172l0.3539-1.9444v-323.81l-0.3521-1.9336c-0.7989-4.3872-2.4411-8.1809-5.0711-11.714-3.9396-5.2933-9.53-8.8696-16.34-10.454l-1.6003-0.3722-57.929-0.089c-54.336-0.083-58.024-0.1062-59.45-0.3698-6.4264-1.1877-11.18-3.7039-15.514-8.2129-1.79-1.8619-1.9963-2.1647-25.631-37.614l-23.826-35.738h-134.74l-23.826 35.738c-23.635 35.45-23.841 35.753-25.631 37.614-4.3347 4.509-9.0878 7.0252-15.514 8.2129-1.4259 0.2636-5.1137 0.2865-59.45 0.3698l-57.929 0.089-1.6002 0.3728c-4.2989 1.0015-7.5139 2.4765-10.901 5.0009-5.4959 4.0966-9.2468 10.209-10.502 17.115l-0.3608 1.9849v323.81l0.3608 1.9849c1.5937 8.7678 7.2759 16.222 15.242 19.996 2.6013 1.2324 5.8993 2.1934 8.4814 2.4714 0.3081 0.033 112.57 0.054 249.48 0.046l248.92-0.015 1.7281-0.3673zm-257.77-52.294c-41.64-2.0186-80.045-22.964-104.41-56.941-11.624-16.211-19.64-35.027-23.189-54.427-1.7265-9.4379-2.3728-17.395-2.216-27.282 0.12-7.5726 0.5963-13.095 1.7196-19.935 3.8753-23.599 13.855-45.662 29.071-64.271 5.4281-6.6385 12.496-13.709 19.169-19.175 18.575-15.217 40.656-25.194 64.41-29.102 12.744-2.0972 26.658-2.3254 39.686-0.6508 41.225 5.2987 77.892
      29.288 99.418 65.043 15.038 24.979 21.593 53.789 18.914 83.133-2.41 26.397-12.712 51.839-29.418 72.652-12.514 15.589-28.414 28.347-46.266 37.12-20.734 10.19-43.778 14.956-66.891 13.836zm10.802-54.561c6.484-0.3606 11.971-1.2507 17.922-2.9073 13.172-3.6664 25.154-10.581 35.024-20.212 11.036-10.767 18.655-23.94 22.321-38.59 5.5889-22.333 1.7247-45.644-10.739-64.787-5.9133-9.0816-14.024-17.316-22.964-23.314-10.64-7.1391-22.472-11.611-35.038-13.244-6.6498-0.8638-14.266-0.8925-20.849-0.078-36.173 4.4728-65.229 32.657-70.803 68.677-1.1433 7.3877-1.2569 15.536-0.3199 22.928 1.9983 15.761 8.1745 29.88 18.551 42.407 2.086 2.5184 7.4814 7.918 10.005 10.013 13.222 10.976 28.508 17.343 45.287 18.864 4.5453 0.412 7.4619 0.473 11.602 0.2428z"
          style={{ strokeWidth: 0.16002 }}
        />
      </g>
    </svg>
  );
};

const { string } = PropTypes;

IconCamera.defaultProps = {
  className: null,
  rootClassName: null,
};

IconCamera.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconCamera;
