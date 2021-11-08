import queryString from 'query-string';
import { types as sdkTypes } from './sdkLoader';
import config from '../config';
const { Money } = sdkTypes;

/**
 * Title descriptor here
 *
 * @param {Object} value - params
 *
 * @return {String} Return value
 */
export const exampleFunction = value => value;

/**
 * Helper function to retrieve nested values from an object
 *
 * @param {Object} theObject - a JS object
 * @param {String} search - the string equivalent of an object key
 *
 * @return {Value} Whatever the value of the search param is or null
 */
export const getPropByName = (theObject, search) => {
  var result = null;
  if (!!theObject) {
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(theObject)) {
      if (key === search) {
        result = value;
      } else if (typeof value === 'object') {
        result = getPropByName(value, search);
      }
      if (result) {
        break;
      }
    }
    return result;
  }
};
