import { flatMap } from 'lodash';
import { nestedRegions } from './nzRegions';

/*
 * Marketplace specific configuration.
 *
 * Every filter needs to have following keys:
 * - id:     Unique id of the filter.
 * - label:  The default label of the filter.
 * - type:   String that represents one of the existing filter components:
 *           BookingDateRangeFilter, KeywordFilter, PriceFilter,
 *           SelectSingleFilter, SelectMultipleFilter.
 * - group:  Is this 'primary' or 'secondary' filter?
 *           Primary filters are visible on desktop layout by default.
 *           Secondary filters are behind "More filters" button.
 *           Read more from src/containers/SearchPage/README.md
 * - queryParamNames: Describes parameters to be used with queries
 *                    (e.g. 'price' or 'pub_amenities'). Most of these are
 *                    the same between webapp URLs and API query params.
 *                    You can't change 'dates', 'price', or 'keywords'
 *                    since those filters are fixed to a specific attribute.
 * - config: Extra configuration that the filter component needs.
 *
 * Note 1: Labels could be tied to translation file
 *         by importing FormattedMessage:
 *         <FormattedMessage id="some.translation.key.here" />
 *
 * Note 2: If you need to add new custom filter components,
 *         you need to take those into use in:
 *         src/containers/SearchPage/FilterComponent.js
 *
 * Note 3: If you just want to create more enum filters
 *         (i.e. SelectSingleFilter, SelectMultipleFilter),
 *         you can just add more configurations with those filter types
 *         and tie them with correct extended data key
 *         (i.e. pub_<key> or meta_<key>).
 */
export const filters = [
  {
    id: 'locIsland',
    label: 'Location',
    type: 'SelectRegionFilter',
    group: 'primary',
    queryParamNames: ['pub_locIsland', 'pub_locRegion', 'pub_locDistrict'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: nestedRegions.map(island => {
        return { key: island.key, label: island.label };
      }),
    },
  },
  {
    id: 'price',
    label: 'Price',
    type: 'PriceFilter',
    group: 'primary',
    // Note: PriceFilter is fixed filter,
    // you can't change "queryParamNames: ['price'],"
    listingType: ['listing'],
    queryParamNames: ['price'],
    // Price filter configuration
    // Note: unlike most prices this is not handled in subunits
    config: {
      min: 0,
      max: 1000,
      step: 5,
    },
  },
  {
    id: 'dates',
    label: 'Dates',
    type: 'BookingDateRangeFilter',
    group: 'primary',
    // Note: BookingDateRangeFilter is fixed filter,
    // you can't change "queryParamNames: ['dates'],"
    listingType: ['listing', 'advert'],
    queryParamNames: ['dates'],
    config: {},
  },
  {
    id: 'preferredUse',
    label: 'Preferred Use',
    type: 'SelectMultipleFilter',
    group: 'primary',
    queryParamNames: ['pub_preferredUse'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'storage', label: 'Storage space' },
        { key: 'creative', label: 'Creative space' },
        { key: 'work', label: 'Work space' },
        { key: 'event', label: 'Event space' },
      ],
    },
  },
  {
    id: 'keyword',
    label: 'Keyword',
    type: 'KeywordFilter',
    group: 'primary',
    // Note: KeywordFilter is fixed filter,
    // you can't change "queryParamNames: ['keywords'],"
    listingType: ['listing', 'advert'],
    queryParamNames: ['keywords'],
    // NOTE: If you are ordering search results by distance
    // the keyword search can't be used at the same time.
    // You can turn on/off ordering by distance from config.js file.
    config: {},
  },

  {
    id: 'listingType',
    label: 'Type',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_listingType'],
    listingType: [],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'advert', label: 'Advert' },
        { key: 'listing', label: 'Listing' },
      ],
    },
  },

  {
    id: 'sizeOfSpace',
    label: 'Size',
    type: 'SelectRangeFilter',
    group: 'primary',
    listingType: ['listing'],
    queryParamNames: ['pub_sizeOfSpace'],
    config: {
      min: 1,
      max: 1000,
      step: 1,
      customFormat: 'm2',
    },
  },
  {
    id: 'ageOfSpace',
    label: 'Age',
    type: 'SelectRangeFilter',
    group: 'primary',
    listingType: ['listing'],
    queryParamNames: ['pub_ageOfSpace'],
    config: {
      min: 1,
      max: 100,
      step: 1,
      customFormat: 'years',
    },
  },

  {
    id: 'locRegion',
    label: 'Region',
    type: null,
    group: 'primary',
    queryParamNames: ['pub_locRegion'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: nestedRegions.flatMap(island => {
        return island.subdivs.map(region => {
          return { key: region.key, label: region.label, parent: island.key };
        });
      }),
    },
  },
  {
    id: 'locDistrict',
    label: 'District',
    type: null,
    group: 'primary',
    queryParamNames: ['pub_locDistrict'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: nestedRegions.flatMap(island => {
        return island.subdivs.flatMap(region => {
          return region.subdivs.flatMap(district => {
            return { key: district.key, label: district.label, parent: region.key };
          });
        });
      }),
    },
  },
  {
    id: 'amenities',
    label: 'Features',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    listingType: ['listing'],
    queryParamNames: ['pub_amenities'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_all',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'weatherproof',
          label: 'Weatherproof',
          checkedIcon: 'beachAccess',
          unCheckedIcon: 'beachAccessOutlined',
        },
        {
          key: 'secure',
          label: 'Secure',
          checkedIcon: 'lock',
          unCheckedIcon: 'lockOutlined',
        },
        {
          key: 'mainsPower',
          label: 'Mains power',
          checkedIcon: 'power',
          unCheckedIcon: 'powerOutlined',
        },
        {
          key: 'waterSupply',
          label: 'Water supply',
          checkedIcon: 'water',
          unCheckedIcon: 'waterOutlined',
        },
        {
          key: 'internet',
          label: 'Internet',
          checkedIcon: 'internet',
          unCheckedIcon: 'internetOutlined',
        },
        {
          key: 'wc',
          label: 'Toilet',
          checkedIcon: 'wc',
          unCheckedIcon: 'wcOutlined',
        },
        {
          key: 'parking',
          label: 'Parking',
          checkedIcon: 'parking',
          unCheckedIcon: 'parkingOutlined',
        },
      ],
    },
  },
  {
    id: 'listingAccessFrequency',
    label: 'How much access would you permit?',
    type: 'none',
    group: 'secondary',
    listingType: ['listing'],
    queryParamNames: ['pub_accessFrequency'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_any',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'anytimeUnrestricted',
          label: 'Anytime, access is not restricted',
        },
        {
          key: 'anytimeArranged',
          label: 'Anytime, but by arrangement',
        },
        {
          key: 'weekendsOnly',
          label: 'Prefer only weekends',
        },
        {
          key: 'weekdaysOnly',
          label: 'Prefer only office hours',
        },
        {
          key: 'negotiable',
          label: 'Negotiable',
        },
      ],
    },
  },
  {
    id: 'advertAccessFrequency',
    label: 'Access Frequency',
    type: 'none',
    group: 'secondary',
    listingType: ['advert'],
    queryParamNames: ['pub_accessFrequency'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_any',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'anytimeUnrestricted',
          label: "All the time",
        },
        {
          key: 'anytimeArranged',
          label: "Anytime, but I'll let you know",
        },
        {
          key: 'weekdaysOnly',
          label: 'Typically only weekdays',
        },
        {
          key: 'weekendsOnly',
          label: 'Typically only weekends',
        },
        {
          key: 'infrequently',
          label: 'Pretty infrequently',
        },
        {
          key: 'dropAndCollect',
          label: 'Once to drop off, once to collect',
        },
        {
          key: 'negotiable',
          label: 'Negotiable',
        },
      ],
    },
  },
  {
    id: 'groundRules',
    label: 'Ground rules',
    type: 'none',
    group: 'secondary',
    listingType: ['listing'],
    queryParamNames: ['pub_accessFrequency'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_any',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'noSmoking',
          label: 'No smoking',
        },
        {
          key: 'noPets',
          label: 'No pets',
        },
        {
          key: 'noGuests',
          label: 'No guests',
        },
        {
          key: 'noSignage',
          label: 'No signage',
        },
      ],
    },
  },
];

export const sortConfig = {
  // Enable/disable the sorting control in the SearchPage
  active: true,

  // Note: queryParamName 'sort' is fixed,
  // you can't change it since Flex API expects it to be named as 'sort'
  queryParamName: 'sort',

  // Internal key for the relevance option, see notes below.
  relevanceKey: 'relevance',

  // Keyword filter is sorting the results already by relevance.
  // If keyword filter is active, we need to disable sorting.
  conflictingFilters: ['keyword'],

  options: [
    { key: 'createdAt', label: 'Newest' },
    { key: '-createdAt', label: 'Oldest' },
    { key: '-price', label: 'Lowest price' },
    { key: 'price', label: 'Highest price' },

    // The relevance is only used for keyword search, but the
    // parameter isn't sent to the Marketplace API. The key is purely
    // for handling the internal state of the sorting dropdown.
    { key: 'relevance', label: 'Relevance', longLabel: 'Relevance (Keyword search)' },
  ],
};
