import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
const defaultLocations = [
  {
    id: 'default-auckland',
    predictionPlace: {
      address: 'Auckland, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-35.59904101703, 176.00311797793),
        new LatLng(-37.4634529902859, 173.835509403703)
      ),
    },
  },
  {
    id: 'default-wellington',
    predictionPlace: {
      address: 'Wellington, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-40.5339530372785, 176.640029955358),
        new LatLng(-41.915010998683, 174.388037138869)
      ),
    },
  },
  {
    id: 'default-christchurch',
    predictionPlace: {
      address: 'Christchurch, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-43.389891, 172.808772),
        new LatLng(-43.628593, 172.389378)
      ),
    },
  },
  {
    id: 'default-dunedin',
    predictionPlace: {
      address: 'Dunedin, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-45.772203, 170.75089),
        new LatLng(-45.953174, 170.290199)
      ),
    },
  },
];
export default defaultLocations;
