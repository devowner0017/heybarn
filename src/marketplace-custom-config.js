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
    id: 'price',
    label: 'Price',
    type: 'PriceFilter',
    group: 'primary',
    // Note: PriceFilter is fixed filter,
    // you can't change "queryParamNames: ['price'],"
    listingType: ['listing', 'advert'],
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
    listingType: ['listing', 'advert'],
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
    id: 'preferredUse',
    label: 'Preferred Use',
    type: 'SelectSingleFilter',
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
    id: 'category',
    label: 'Category',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_category'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'smoke', label: 'Smoke' },
        { key: 'electric', label: 'Electric' },
        { key: 'wood', label: 'Wood' },
        { key: 'other', label: 'Other' },
      ],
    },
  },
  {
    id: 'locIsland',
    label: 'Island',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_locIsland'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'northIsland', label: 'North Island' },
        { key: 'southIsland', label: 'South Island' },
      ],
    },
  },
  {
    id: 'locRegion',
    label: 'Region',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_locRegion'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'bayOfPlenty', label: 'Bay of Plenty Region' },
        { key: 'hawkesBay', label: "Hawke's Bay Region" },
        { key: 'manawatu', label: 'Manawatū-Whanganui Region' },
        { key: 'northland', label: 'Northland Region' },
        { key: 'taranaki', label: 'Taranaki Region' },
        { key: 'waikato', label: 'Waikato Region' },
        { key: 'mixed', label: 'Mixed' },
        { key: 'unitaryAuthority', label: 'Unitary Authority' },
        { key: 'canterbury', label: 'Canterbury Region' },
        { key: 'otago', label: 'Otago Region' },
        { key: 'southland', label: 'Southland Region' },
        { key: 'westCoast', label: 'West Coast Region' },
      ],
    },
  },
  {
    id: 'locDistrict',
    label: 'District',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_locDistrict'],
    listingType: ['listing', 'advert'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'kawerau', label: 'Kawerau District' },
        { key: 'opotiki', label: 'Ōpōtiki District' },
        { key: 'westernBayOfPlenty', label: 'Western Bay of Plenty District' },
        { key: 'whakatane', label: 'Whakatane District' },
        { key: 'centralHawkesBay', label: "Central Hawke's Bay District" },
        { key: 'hastings', label: 'Hastings District' },
        { key: 'wairoa', label: 'Wairoa District' },
        { key: 'horowhenua', label: 'Horowhenua District' },
        { key: 'manawatu', label: 'Manawatu District' },
        { key: 'ruapehu', label: 'Ruapehu District' },
        { key: 'whanganui', label: 'Whanganui District' },
        { key: 'farNorth', label: 'Far North District' },
        { key: 'kaipara', label: 'Kaipara District' },
        { key: 'whangarei', label: 'Whangarei District' },
        { key: 'newPlymouth', label: 'New Plymouth District' },
        { key: 'southTaranaki', label: 'South Taranaki District' },
        { key: 'hauraki', label: 'Hauraki District' },
        { key: 'matamataPiako', label: 'Matamata-Piako District' },
        { key: 'otorohanga', label: 'Otorohanga District' },
        { key: 'southWaikato', label: 'South Waikato District' },
        { key: 'thamesCoromandel', label: 'Thames-Coromandel District' },
        { key: 'waikato', label: 'Waikato District' },
        { key: 'waipa', label: 'Waipa District' },
        { key: 'carterton', label: 'Carterton District' },
        { key: 'kapitiCoast', label: 'Kapiti Coast District' },
        { key: 'masterton', label: 'Masterton District' },
        { key: 'southWairarapa', label: 'South Wairarapa District' },
        {
          key: 'rangitikei',
          label: "Rangitikei District (Manawatū-Whanganui: 86.37%; Hawke's Bay: 13.63%)",
        },
        {
          key: 'rotoruaLakes',
          label: 'Rotorua Lakes (Bay of Plenty: 61.52%; Waikato: 38.48%)',
        },
        {
          key: 'stratford',
          label: 'Stratford District (Taranaki: 68.13%; Manawatū-Whanganui: 31.87%)',
        },
        {
          key: 'tararua',
          label: 'Tararua District (Manawatū-Whanganui: 98.42%; Wellington: 1.58%)',
        },
        {
          key: 'taupo',
          label:
            "Taupo District (Waikato: 73.74%; Bay of Plenty: 14.31%; Hawke's Bay: 11.26%; Manawatū-Whanganui: 0.69%)",
        },
        {
          key: 'waitomo',
          label: 'Waitomo District (Waikato: 94.87%; Manawatū-Whanganui: 5.13%)',
        },
        { key: 'gisborne', label: 'Gisborne District' },
        { key: 'ashburton', label: 'Ashburton District' },
        { key: 'hurunui', label: 'Hurunui District' },
        { key: 'kaikoura', label: 'Kaikoura District' },
        { key: 'mackenzie', label: 'Mackenzie District' },
        { key: 'selwyn', label: 'Selwyn District' },
        { key: 'timaru', label: 'Timaru District' },
        { key: 'waimakariri', label: 'Waimakariri District' },
        { key: 'waimate', label: 'Waimate District' },
        { key: 'centralOtago', label: 'Central Otago District' },
        { key: 'clutha', label: 'Clutha District' },
        { key: 'queenstownLakes', label: 'Queenstown-Lakes District' },
        { key: 'gore', label: 'Gore District' },
        { key: 'southland', label: 'Southland District' },
        { key: 'buller', label: 'Buller District' },
        { key: 'grey', label: 'Grey District' },
        { key: 'westland', label: 'Westland District' },
        {
          key: 'waitaki',
          label: 'Waitaki District (Canterbury: 59.61%; Otago: 40.39%)',
        },
        { key: 'marlborough', label: 'Marlborough District' },
        { key: 'tasman', label: 'Tasman District' },
      ],
    },
  },
  {
    id: 'amenities',
    label: 'Amenities',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    listingType: ['listing', 'advert'],
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
          key: 'towels',
          label: 'Towels',
        },
        {
          key: 'bathroom',
          label: 'Bathroom',
        },
        {
          key: 'swimming_pool',
          label: 'Swimming pool',
        },
        {
          key: 'own_drinks',
          label: 'Own drinks allowed',
        },
        {
          key: 'jacuzzi',
          label: 'Jacuzzi',
        },
        {
          key: 'audiovisual_entertainment',
          label: 'Audiovisual entertainment',
        },
        {
          key: 'barbeque',
          label: 'Barbeque',
        },
        {
          key: 'own_food_allowed',
          label: 'Own food allowed',
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
