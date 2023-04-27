import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

export const nestedRegions = [
  {
    key: 'northIsland',
    label: 'North Island',
    subdivs: [
      {
        key: 'Northland',
        label: 'Northland Region',
        bounds: new LatLngBounds(
          new LatLng(-34.394766, 178.898438),
          new LatLng(-41.287454, 171.245361)
        ),
        subdivs: [
          {
            key: 'Dargaville',
            label: 'Dargaville',
            address: 'Dargaville, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-35.891695, 173.93404),
              new LatLng(-36.017076, 173.799227)
            ),
          },
          {
            key: 'Kaikohe',
            label: 'Kaikohe',
            address: 'Kaikohe, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-35.347528, 174.068939),
              new LatLng(-35.424446, 173.98045)
            ),
          },
          {
            key: 'Kaitaia',
            label: 'Kaitaia',
            address: 'Kaitaia, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-34.993633, 173.5469),
              new LatLng(-35.094638, 173.441566)
            ),
          },
          {
            key: 'Kawakawa',
            label: 'Kawakawa',
            address: 'Kawakawa, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-35.315859, 174.126522),
              new LatLng(-35.394957, 174.033409)
            ),
          },
          {
            key: 'Kerikeri',
            label: 'Kerikeri',
            address: 'Kerikeri, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-35.167979, 174.04908),
              new LatLng(-35.258978, 173.9319)
            ),
          },
          {
            key: 'Mangawhai',
            label: 'Mangawhai',
            address: 'Mangawhai, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.068257, 174.601014),
              new LatLng(-36.151171, 174.520859)
            ),
          },
          {
            key: 'Maungaturoto',
            label: 'Maungaturoto',
            address: 'Maungaturoto, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.161684, 174.413086),
              new LatLng(-36.244598, 174.332931)
            ),
          },
          {
            key: 'Paihia',
            label: 'Paihia',
            address: 'Paihia, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-35.273834, 174.118116),
              new LatLng(-35.313243, 174.065563)
            ),
          },
          {
            key: 'Whangarei',
            label: 'Whangarei',
            address: 'Whangarei, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-35.705181, 174.402714),
              new LatLng(-35.758392, 174.29911)
            ),
          },
        ],
      },
      {
        key: 'Auckland',
        label: 'Auckland Region',
        subdivs: [
          {
            key: 'Albany',
            label: 'Albany',
            address: 'Albany, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.714795, 174.709122),
              new LatLng(-36.744982, 174.671103)
            ),
          },
          {
            key: 'AucklandCity',
            label: 'Auckland city',
            address: 'Auckland CBD, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.840707, 174.761579),
              new LatLng(-36.862263, 174.757655)
            ),
          },
          {
            key: 'BotabyDowns',
            label: 'Botaby Downs',
            address: 'Botany Downs, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.909536, 174.914593),
              new LatLng(-36.941376, 174.878068)
            ),
          },
          {
            key: 'Clevedon',
            label: 'Clevedon',
            address: 'Clevedon, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.012656, 175.013014),
              new LatLng(-37.042034, 174.973002)
            ),
          },
          {
            key: 'Franklin',
            label: 'Franklin',
            address: 'Franklin, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.237824, 174.817956),
              new LatLng(-37.284451, 174.694848)
            ),
          },
          {
            key: 'GreatBarrierIsland',
            label: 'Great Barrier Island',
            address: 'Great Barrier Island, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.143539, 175.340377),
              new LatLng(-36.297133, 175.088337)
            ),
          },
          {
            key: 'Helensville',
            label: 'Helensville',
            address: 'Helensville, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.664692, 174.448332),
              new LatLng(-36.694112, 174.413921)
            ),
          },
          {
            key: 'Henderson',
            label: 'Henderson',
            address: 'Henderson, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.862283, 174.621755),
              new LatLng(-36.892658, 174.570824)
            ),
          },
          {
            key: 'HibiscusCoast',
            label: 'Hibiscus Coast',
            address: 'Hibiscus Coast, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.476344, 174.736322),
              new LatLng(-36.643222, 174.603695)
            ),
          },
          {
            key: 'Kumeu',
            label: 'Kumeu',
            address: 'Kumeu, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.76671, 174.539718),
              new LatLng(-36.797821, 174.486162)
            ),
          },
          {
            key: 'Mangere',
            label: 'Mangere',
            address: 'Mangere, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.966465, 174.798243),
              new LatLng(-37.000642, 174.742503)
            ),
          },
          {
            key: 'Manukau',
            label: 'Manukau',
            address: 'Manukau, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.992993, 174.904403),
              new LatLng(-37.024378, 174.857812)
            ),
          },
          {
            key: 'NewLynn',
            label: 'New Lynn',
            address: 'New Lynn, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.903704, 174.68034),
              new LatLng(-36.931171, 174.630804)
            ),
          },
          {
            key: 'NorthShore',
            label: 'North Shore',
            address: 'North Shore, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.716954, 174.778532),
              new LatLng(-36.793949, 174.644905)
            ),
          },
          {
            key: 'Onehunga',
            label: 'Onehunga',
            address: 'Onehunga, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.926062, 174.797484),
              new LatLng(-36.953526, 174.760547)
            ),
          },
          {
            key: 'Papakura',
            label: 'Papakura',
            address: 'Papakura, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.047854, 174.964631),
              new LatLng(-37.083729, 174.92185)
            ),
          },
          {
            key: 'Pukekohe',
            label: 'Pukekohe',
            address: 'Pukekohe, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.178475, 174.945877),
              new LatLng(-37.220757, 174.881944)
            ),
          },
          {
            key: 'Remuera',
            label: 'Remuera',
            address: 'Remuera, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.871163, 174.811392),
              new LatLng(-36.903203, 174.772915)
            ),
          },
          {
            key: 'WaihekeIsland',
            label: 'Waiheke Island',
            address: 'Waiheke Island, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.774706, 175.180745),
              new LatLng(-36.801009, 174.988321)
            ),
          },
          {
            key: 'Waitakere',
            label: 'Waitakere',
            address: 'Waitakere, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.855896, 174.52362),
              new LatLng(-36.892075, 174.476071)
            ),
          },
          {
            key: 'Waiuku',
            label: 'Waiuku',
            address: 'Waiuku, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.24948, 174.764907),
              new LatLng(-37.282248, 174.705567)
            ),
          },
          {
            key: 'Warkworth',
            label: 'Warkworth',
            address: 'Warkworth, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.388068, 174.676554),
              new LatLng(-36.419214, 174.628814)
            ),
          },
          {
            key: 'Wellsford',
            label: 'Wellsford',
            address: 'Wellsford, Auckland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.283254, 174.527282),
              new LatLng(-36.31011, 174.48386)
            ),
          },
        ],
      },
      {
        key: 'Waikato',
        label: 'Waikato Region',
        subdivs: [
          {
            key: 'Cambridge',
            label: 'Cambridge',
            address: 'Cambridge, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.915227, 175.512962),
              new LatLng(-37.929689, 175.443273)
            ),
          },
          {
            key: 'Coromandel',
            label: 'Coromandel',
            address: 'Coromandel, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.755033, 175.509792),
              new LatLng(-36.786562, 175.444401)
            ),
          },
          {
            key: 'Hamilton',
            label: 'Hamilton',
            address: 'Hamilton, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.721078, 175.338396),
              new LatLng(-37.805757, 175.220496)
            ),
          },
          {
            key: 'Huntly',
            label: 'Huntly',
            address: 'Huntly, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.546063, 175.180904),
              new LatLng(-37.572646, 175.134709)
            ),
          },
          {
            key: 'Matamata',
            label: 'Matamata',
            address: 'Matamata, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.835825, 175.81037),
              new LatLng(-37.854879, 175.742108)
            ),
          },
          {
            key: 'Morrinsville',
            label: 'Morrinsville',
            address: 'Morrinsville, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.648617, 175.573013),
              new LatLng(-37.675362, 175.517836)
            ),
          },
          {
            key: 'Ngaruawahia',
            label: 'Ngaruawahia',
            address: 'Ngaruawahia, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.65811, 175.176703),
              new LatLng(-37.692154, 175.120201)
            ),
          },
          {
            key: 'Ngatea',
            label: 'Ngatea',
            address: 'Ngatea, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.199008, 175.555178),
              new LatLng(-37.214712, 175.512054)
            ),
          },
          {
            key: 'Otorohanga',
            label: 'Otorohanga',
            address: 'Otorohanga, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.171186, 175.226175),
              new LatLng(-38.193785, 175.16919)
            ),
          },
          {
            key: 'Paeroa',
            label: 'Paeroa',
            address: 'Paeroa, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.359536, 175.711162),
              new LatLng(-37.383035, 175.645157)
            ),
          },
          {
            key: 'Raglan',
            label: 'Raglan',
            address: 'Raglan, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.796507, 174.87891),
              new LatLng(-37.834552, 174.826706)
            ),
          },
          {
            key: 'Taumaranui',
            label: 'Taumarunui',
            address: 'Taumarunui, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.883413, 175.263186),
              new LatLng(-38.900649, 175.194799)
            ),
          },
          {
            key: 'Taupo',
            label: 'Taupo',
            address: 'Taupo, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.684761, 176.068802),
              new LatLng(-38.724509, 175.995692)
            ),
          },
          {
            key: 'TeAwamutu',
            label: 'Te Awamutu',
            address: 'Te Awamutu, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.008539, 175.326964),
              new LatLng(-38.047749, 175.275058)
            ),
          },
          {
            key: 'TeKuiti',
            label: 'Te Kuiti',
            address: 'Te Kuiti, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.331174, 175.16574),
              new LatLng(-38.353084, 175.110164)
            ),
          },
          {
            key: 'Thames',
            label: 'Thames',
            address: 'Thames, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.132348, 175.555611),
              new LatLng(-37.158528, 175.495172)
            ),
          },
          {
            key: 'TokoroaPutaruru',
            label: 'Tokoroa/Putaruru',
            address: 'Tokoroa/Putaruru, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.220589, 175.876618),
              new LatLng(-38.242196, 175.82094)
            ),
          },
          {
            key: 'Turangi',
            label: 'Turangi',
            address: 'Turangi, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.009335, 175.824498),
              new LatLng(-39.02887, 175.764567)
            ),
          },
          {
            key: 'Waihi',
            label: 'Waihi',
            address: 'Waihi, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.383858, 175.854876),
              new LatLng(-37.411323, 175.792812)
            ),
          },
          {
            key: 'Whangamata',
            label: 'Whangamata',
            address: 'Whangamata, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.201665, 175.871395),
              new LatLng(-37.23266, 175.814981)
            ),
          },
          {
            key: 'Whitianga',
            label: 'Whitianga',
            address: 'Whitianga, Waikato, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-36.817512, 175.71692),
              new LatLng(-36.847951, 175.658183)
            ),
          },
        ],
      },
      {
        key: 'BayPlenty',
        label: 'Bay of Plenty Region',
        subdivs: [
          {
            key: 'Katikati',
            label: 'Katikati',
            address: 'Katikati, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.572108, 175.944211),
              new LatLng(-37.551707, 175.915715)
            ),
          },
          {
            key: 'Kawerau',
            label: 'Kawerau',
            address: 'Kawerau, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.104164, 176.720872),
              new LatLng(-38.081543, 176.695658)
            ),
          },
          {
            key: 'MtMaunganui',
            label: 'Mt Maunganui',
            address: 'Mount Maunganui, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.640346, 176.218409),
              new LatLng(-37.627772, 176.172508)
            ),
          },
          {
            key: 'Opotiki',
            label: 'Opotiki',
            address: 'Opotiki, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.0128, 177.29034),
              new LatLng(-37.993321, 177.261519)
            ),
          },
          {
            key: 'Papamoa',
            label: 'Papamoa',
            address: 'Papamoa, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.696706, 176.295199),
              new LatLng(-37.679339, 176.235197)
            ),
          },
          {
            key: 'Rotorua',
            label: 'Rotorua',
            address: 'Rotorua, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.166872, 176.260726),
              new LatLng(-38.13172, 176.202545)
            ),
          },
          {
            key: 'Tauranga',
            label: 'Tauranga',
            address: 'Tauranga, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.704881, 176.173177),
              new LatLng(-37.670137, 176.125272)
            ),
          },
          {
            key: 'TePuke',
            label: 'Te Puke',
            address: 'Te Puke, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.788435, 176.327685),
              new LatLng(-37.773823, 176.294837)
            ),
          },
          {
            key: 'WaihiBeach',
            label: 'Waihi Beach',
            address: 'Waihi Beach, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.448531, 175.994736),
              new LatLng(-37.431919, 175.965589)
            ),
          },
          {
            key: 'Whakatane',
            label: 'Whakatane',
            address: 'Whakatane, Bay of Plenty, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.959262, 177.030727),
              new LatLng(-37.944997, 176.998205)
            ),
          },
        ],
      },
      {
        key: 'Gisborne',
        label: 'Gisborne',
        subdivs: [
          {
            key: 'Gisborne',
            label: 'Gisborne',
            address: 'Gisborne, Gisborne District, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.6736, 178.024758),
              new LatLng(-38.639738, 177.974901)
            ),
          },
          {
            key: 'Ruatoria',
            label: 'Ruatoria',
            address: 'Ruatoria, Gisborne District, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-37.886845, 178.34108),
              new LatLng(-37.870104, 178.313337)
            ),
          },
        ],
      },
      {
        key: 'HawkesBay',
        label: "Hawke's Bay District",
        subdivs: [
          {
            key: 'Hastings',
            label: 'Hastings',
            address: "Hastings, Hawke's Bay, New Zealand",
            bounds: new LatLngBounds(
              new LatLng(-39.671896, 176.849452),
              new LatLng(-39.602536, 176.739722)
            ),
          },
          {
            key: 'Napier',
            label: 'Napier',
            address: "Napier, Hawke's Bay, New Zealand",
            bounds: new LatLngBounds(
              new LatLng(-39.49171, 176.918198),
              new LatLng(-39.465955, 176.857754)
            ),
          },
          {
            key: 'Waipukurau',
            label: 'Waipukurau',
            address: "Waipukurau, Hawke's Bay, New Zealand",
            bounds: new LatLngBounds(
              new LatLng(-40.006449, 176.551675),
              new LatLng(-39.97942, 176.517652)
            ),
          },
          {
            key: 'Wairoa',
            label: 'Wairoa',
            address: "Wairoa, Hawke's Bay, New Zealand",
            bounds: new LatLngBounds(
              new LatLng(-39.033911, 177.429161),
              new LatLng(-39.005856, 177.389442)
            ),
          },
        ],
      },
      {
        key: 'Taranaki',
        label: 'Taranaki Region',
        subdivs: [
          {
            key: 'Hawera',
            label: 'Hawera',
            address: 'Hawera, Taranaki, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.591862, 174.287529),
              new LatLng(-39.564302, 174.251395)
            ),
          },
          {
            key: 'Mokau',
            label: 'Mokau',
            address: 'Mokau, Taranaki, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-38.678102, 174.761508),
              new LatLng(-38.656648, 174.719441)
            ),
          },
          {
            key: 'NewPlymouth',
            label: 'New Plymouth',
            address: 'New Plymouth, Taranaki, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.102361, 174.129771),
              new LatLng(-39.049298, 174.067078)
            ),
          },
          {
            key: 'Opunake',
            label: 'Opunake',
            address: 'Opunake, Taranaki, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.461178, 173.85792),
              new LatLng(-39.431382, 173.818856)
            ),
          },
          {
            key: 'Stratford',
            label: 'Stratford',
            address: 'Stratford, Taranaki, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.345543, 174.292096),
              new LatLng(-39.31952, 174.240425)
            ),
          },
        ],
      },
      {
        key: 'Whanganui',
        label: 'Whanganui Region',
        subdivs: [
          {
            key: 'Ohakune',
            label: 'Ohakune',
            address: 'Ohakune, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.42359, 175.411262),
              new LatLng(-39.385962, 175.365886)
            ),
          },
          {
            key: 'Taihape',
            label: 'Taihape',
            address: 'Taihape, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.680331, 175.798507),
              new LatLng(-39.646616, 175.755104)
            ),
          },
          {
            key: 'Waiouru',
            label: 'Waiouru',
            address: 'Waiouru, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.483508, 175.650213),
              new LatLng(-39.458273, 175.611603)
            ),
          },
          {
            key: 'Whanganui',
            label: 'Whanganui',
            address: 'Whanganui, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-39.939176, 175.080278),
              new LatLng(-39.903142, 174.995304)
            ),
          },
        ],
      },

      {
        key: 'Manawatu',
        label: 'Manawatū-Whanganui Region',
        subdivs: [
          {
            key: 'Bulls',
            label: 'Bulls',
            address: 'Bulls, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.173207, 175.391292),
              new LatLng(-40.162084, 175.378142)
            ),
          },
          {
            key: 'Dannevirke',
            label: 'Dannevirke',
            address: 'Dannevirke, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.225053, 176.098449),
              new LatLng(-40.196966, 176.056686)
            ),
          },
          {
            key: 'Feilding',
            label: 'Feilding',
            address: 'Feilding, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.226042, 175.577378),
              new LatLng(-40.206743, 175.552673)
            ),
          },
          {
            key: 'Levin',
            label: 'Levin',
            address: 'Levin, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.620832, 175.290453),
              new LatLng(-40.601671, 175.264922)
            ),
          },
          {
            key: 'Manawatu',
            label: 'Manawatu',
            address: 'Manawatu District, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.491881, 175.780796),
              new LatLng(-39.839308, 174.752311)
            ),
          },
          {
            key: 'Marton',
            label: 'Marton',
            address: 'Marton, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.071438, 175.391381),
              new LatLng(-40.056776, 175.373663)
            ),
          },
          {
            key: 'Pahiatua',
            label: 'Pahiatua',
            address: 'Pahiatua, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.459419, 175.848558),
              new LatLng(-40.438348, 175.806726)
            ),
          },
          {
            key: 'Palmerston North',
            label: 'Palmerston North',
            address: 'Palmerston North, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.365881, 175.630495),
              new LatLng(-40.338194, 175.590169)
            ),
          },
          {
            key: 'Woodville',
            label: 'Woodville',
            address: 'Woodville, Manawatu-Wanganui, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.341613, 175.801393),
              new LatLng(-40.326567, 175.781463)
            ),
          },
        ],
      },

      {
        key: 'Wairarapa',
        label: 'Wairarapa Region',
        subdivs: [
          {
            key: 'Carterton',
            label: 'Carterton',
            address: 'Carterton, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.037384, 175.535755),
              new LatLng(-40.996774, 175.499277)
            ),
          },
          {
            key: 'Featherston',
            label: 'Featherston',
            address: 'Featherston, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.127882, 175.336285),
              new LatLng(-41.103868, 175.319318)
            ),
          },
          {
            key: 'Greytown',
            label: 'Greytown',
            address: 'Greytown, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.085841, 175.459235),
              new LatLng(-41.062065, 175.442231)
            ),
          },
          {
            key: 'Martinborough',
            label: 'Martinborough',
            address: 'Martinborough, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.220473, 175.465412),
              new LatLng(-41.198998, 175.436075)
            ),
          },
          {
            key: 'Masterton',
            label: 'Masterton',
            address: 'Masterton, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.964948, 175.677222),
              new LatLng(-40.929372, 175.637209)
            ),
          },
        ],
      },
      {
        key: 'Wellington',
        label: 'Wellington Region',
        subdivs: [
          {
            key: 'Kapiti',
            label: 'Kapiti',
            address: 'Kapiti Coast, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.929543, 174.991038),
              new LatLng(-40.813137, 175.207526)
            ),
          },
          {
            key: 'LowerHuttCity',
            label: 'Lower Hutt City',
            address: 'Lower Hutt, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.286464, 174.947673),
              new LatLng(-41.165152, 175.055169)
            ),
          },
          {
            key: 'Porirua',
            label: 'Porirua',
            address: 'Porirua, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.181131, 174.760577),
              new LatLng(-41.082828, 174.904013)
            ),
          },
          {
            key: 'UpperHuttCity',
            label: 'Upper Hutt City',
            address: 'Upper Hutt, Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.177094, 175.014012),
              new LatLng(-41.049923, 175.15295)
            ),
          },
          {
            key: 'WellingtonCity',
            label: 'Wellington City',
            address: 'Wellington, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.364636, 174.747004),
              new LatLng(-41.216315, 174.861523)
            ),
          },
        ],
      },
    ],
  },
  {
    key: 'southIsland',
    label: 'South Island',
    subdivs: [
      {
        key: 'NelsonBays',
        label: 'Nelson Bays Region',
        subdivs: [
          {
            key: 'GoldenBay',
            label: 'Golden Bay',
            address: 'Golden Bay, Tasman, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-40.739282, 172.306061),
              new LatLng(-40.500959, 173.011841)
            ),
          },
          {
            key: 'Motueka',
            label: 'Motueka',
            address: 'Motueka, Tasman, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.144634, 173.000186),
              new LatLng(-41.075853, 173.039932)
            ),
          },
          {
            key: 'Murchison',
            label: 'Murchison',
            address: 'Murchison, Tasman, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.831347, 172.278921),
              new LatLng(-41.785767, 172.343527)
            ),
          },
          {
            key: 'Nelson',
            label: 'Nelson',
            address: 'Nelson, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.37044, 173.219343),
              new LatLng(-41.217557, 173.386287)
            ),
          },
        ],
      },
      {
        key: 'Marlborough',
        label: 'Marlborough Region',
        subdivs: [
          {
            key: 'Blenheim',
            label: 'Blenheim',
            address: 'Blenheim, Marlborough, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.579342, 173.890709),
              new LatLng(-41.475773, 174.036057)
            ),
          },
          {
            key: 'MalboroughSounds',
            label: 'Marlborough Sounds',
            address: 'Marlborough Sounds, Marlborough, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.414729, 173.539498),
              new LatLng(-40.632069, 174.492245)
            ),
          },
          {
            key: 'Picton',
            label: 'Picton',
            address: 'Picton, Marlborough, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.334067, 174.005365),
              new LatLng(-41.263813, 174.057488)
            ),
          },
        ],
      },
      {
        key: 'WestCoast',
        label: 'West Coast Region',
        subdivs: [
          {
            key: 'Greymouth',
            label: 'Greymouth',
            address: 'Greymouth, West Coast, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-42.495082, 171.100826),
              new LatLng(-42.400759, 171.289822)
            ),
          },
          {
            key: 'Hokitika',
            label: 'Hokitika',
            address: 'Hokitika, West Coast, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-42.74326, 170.904638),
              new LatLng(-42.690726, 171.01971)
            ),
          },
          {
            key: 'Westport',
            label: 'Westport',
            address: 'Westport, West Coast, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-41.780935, 171.5562),
              new LatLng(-41.733209, 171.628877)
            ),
          },
        ],
      },
      {
        key: 'Canterbury',
        label: 'Canterbury Region',
        subdivs: [
          {
            key: 'Amberley',
            label: 'Amberley',
            address: 'Amberley, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.184344, 172.711074),
              new LatLng(-43.133938, 172.776986)
            ),
          },
          {
            key: 'Ashburton',
            label: 'Ashburton',
            address: 'Ashburton, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.919707, 171.685637),
              new LatLng(-43.862344, 171.807392)
            ),
          },
          {
            key: 'Belfast',
            label: 'Belfast',
            address: 'Belfast, Christchurch, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.377031, 172.598645),
              new LatLng(-43.326929, 172.681767)
            ),
          },
          {
            key: 'Cheviot',
            label: 'Cheviot',
            address: 'Cheviot, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-42.82968, 173.259577),
              new LatLng(-42.77362, 173.304733)
            ),
          },
          {
            key: 'ChristchurchCity',
            label: 'Christchurch City',
            address: 'Christchurch, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.661196, 172.476792),
              new LatLng(-43.467922, 172.765917)
            ),
          },
          {
            key: 'Darfield',
            label: 'Darfield',
            address: 'Darfield, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.472665, 172.08255),
              new LatLng(-43.418861, 172.147676)
            ),
          },
          {
            key: 'Fairlie',
            label: 'Fairlie',
            address: 'Fairlie, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-44.095917, 170.79832),
              new LatLng(-44.049953, 170.879661)
            ),
          },
          {
            key: 'Ferrymead',
            label: 'Ferrymead',
            address: 'Ferrymead, Christchurch, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.561664, 172.706986),
              new LatLng(-43.542393, 172.743764)
            ),
          },
          {
            key: 'Geraldine',
            label: 'Geraldine',
            address: 'Geraldine, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-44.097254, 171.182791),
              new LatLng(-44.031425, 171.297601)
            ),
          },
          {
            key: 'Halswell',
            label: 'Halswell',
            address: 'Halswell, Christchurch, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.601597, 172.519573),
              new LatLng(-43.535395, 172.579208)
            ),
          },
          {
            key: 'HanmerSprings',
            label: 'Hanmer Springs',
            address: 'Hanmer Springs, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-42.544403, 172.775655),
              new LatLng(-42.496455, 172.854961)
            ),
          },
          {
            key: 'Kaiapoi',
            label: 'Kaiapoi',
            address: 'Kaiapoi, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.383279, 172.626547),
              new LatLng(-43.333064, 172.695413)
            ),
          },

          {
            key: 'Lyttelton',
            label: 'Lyttelton',
            address: 'Lyttelton, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.636734, 172.655807),
              new LatLng(-43.592789, 172.744194)
            ),
          },
          {
            key: 'MtCook',
            label: 'Mt Cook',
            address: 'Mt Cook, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.604471, 170.117437),
              new LatLng(-43.385939, 170.476898)
            ),
          },
          {
            key: 'Rangiora',
            label: 'Rangiora',
            address: 'Rangiora, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.320708, 172.536129),
              new LatLng(-43.28745, 172.619085)
            ),
          },
          {
            key: 'Rolleston',
            label: 'Rolleston',
            address: 'Rolleston, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.59792, 172.356824),
              new LatLng(-43.541038, 172.43493)
            ),
          },
          {
            key: 'Selwyn',
            label: 'Selwyn',
            address: 'Selwyn, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.662116, 172.397334),
              new LatLng(-43.336226, 172.826126)
            ),
          },
        ],
      },
      {
        key: 'TimaruOtago',
        label: 'Timaru-Otago Region',
        subdivs: [
          {
            key: 'Lyttelton',
            label: 'Lyttelton',
            address: 'Lyttelton, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.626858, 172.66679),
              new LatLng(-43.587561, 172.741516)
            ),
          },
          {
            key: 'MtCook',
            label: 'Mt Cook',
            address: 'Mount Cook, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.757194, 170.091278),
              new LatLng(-43.570266, 170.311731)
            ),
          },
          {
            key: 'Rangiora',
            label: 'Rangiora',
            address: 'Rangiora, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.308174, 172.571356),
              new LatLng(-43.265755, 172.655919)
            ),
          },
          {
            key: 'Rolleston',
            label: 'Rolleston',
            address: 'Rolleston, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.60541, 172.347496),
              new LatLng(-43.556196, 172.433966)
            ),
          },
          {
            key: 'Selwyn',
            label: 'Selwyn',
            address: 'Selwyn, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-43.677487, 172.342029),
              new LatLng(-43.408271, 172.659161)
            ),
          },
          {
            key: 'Kurow',
            label: 'Kurow',
            address: 'Kurow, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-44.635282, 170.396956),
              new LatLng(-44.623557, 170.411834)
            ),
          },
          {
            key: 'Oamaru',
            label: 'Oamaru',
            address: 'Oamaru, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.130563, 170.958382),
              new LatLng(-45.050402, 171.16584)
            ),
          },
          {
            key: 'Timaru',
            label: 'Timaru',
            address: 'Timaru, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-44.408302, 171.204471),
              new LatLng(-44.336399, 171.300645)
            ),
          },
          {
            key: 'Twizel',
            label: 'Twizel',
            address: 'Twizel, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-44.318621, 170.03863),
              new LatLng(-43.95693, 170.644607)
            ),
          },
          {
            key: 'Waimate',
            label: 'Waimate',
            address: 'Waimate, Canterbury, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-44.748782, 170.96616),
              new LatLng(-44.603901, 171.235946)
            ),
          },
        ],
      },
      {
        key: 'Otago',
        label: 'Otago Region',
        subdivs: [
          {
            key: 'Alexandra',
            label: 'Alexandra',
            address: 'Alexandra, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.256211, 169.303139),
              new LatLng(-45.194222, 169.390706)
            ),
          },
          {
            key: 'Balclutha',
            label: 'Balclutha',
            address: 'Balclutha, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.236764, 169.712861),
              new LatLng(-46.228555, 169.769165)
            ),
          },
          {
            key: 'Cromwell',
            label: 'Cromwell',
            address: 'Cromwell, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.072563, 169.135017),
              new LatLng(-44.981338, 169.286968)
            ),
          },
          {
            key: 'Dunedin',
            label: 'Dunedin',
            address: 'Dunedin, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.993769, 170.261413),
              new LatLng(-45.806478, 170.354233)
            ),
          },
          {
            key: 'Lawrence',
            label: 'Lawrence',
            address: 'Lawrence, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.908787, 169.715342),
              new LatLng(-45.863873, 169.784677)
            ),
          },
          {
            key: 'Milton',
            label: 'Milton',
            address: 'Milton, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.125874, 169.833477),
              new LatLng(-46.101659, 169.873037)
            ),
          },
          {
            key: 'Palmerston',
            label: 'Palmerston',
            address: 'Palmerston, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.478928, 170.710203),
              new LatLng(-45.444182, 170.764081)
            ),
          },
          {
            key: 'Queenstown',
            label: 'Queenstown',
            address: 'Queenstown, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.078885, 168.609931),
              new LatLng(-44.986901, 168.731215)
            ),
          },
          {
            key: 'Ranfurly',
            label: 'Ranfurly',
            address: 'Ranfurly, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.104826, 170.085997),
              new LatLng(-45.023834, 170.204269)
            ),
          },
          {
            key: 'Roxburgh',
            label: 'Roxburgh',
            address: 'Roxburgh, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.510938, 169.202511),
              new LatLng(-45.470559, 169.271413)
            ),
          },
          {
            key: 'Tapanui',
            label: 'Tapanui',
            address: 'Tapanui, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.138012, 169.386719),
              new LatLng(-46.112978, 169.42663)
            ),
          },
          {
            key: 'Roxburgh',
            label: 'Roxburgh',
            address: 'Roxburgh, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.50063, 169.031644),
              new LatLng(-45.375296, 169.257732)
            ),
          },
          {
            key: 'Tapanui',
            label: 'Tapanui',
            address: 'Tapanui, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.142024, 169.289233),
              new LatLng(-46.032658, 169.408063)
            ),
          },
          {
            key: 'Wanaka',
            label: 'Wanaka',
            address: 'Wanaka, Otago, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-44.801546, 168.988524),
              new LatLng(-44.648888, 169.408842)
            ),
          },
        ],
      },
      {
        key: 'Southland',
        label: 'Southland Region',
        subdivs: [
          {
            key: 'Bluff',
            label: 'Bluff',
            address: 'Bluff, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.640063, 168.292554),
              new LatLng(-46.593271, 168.360561)
            ),
          },
          {
            key: 'Edendale',
            label: 'Edendale',
            address: 'Edendale, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.33668, 168.885436),
              new LatLng(-46.272385, 168.958343)
            ),
          },
          {
            key: 'Gore',
            label: 'Gore',
            address: 'Gore, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.115101, 168.902089),
              new LatLng(-45.970224, 169.067492)
            ),
          },
          {
            key: 'Invercargill',
            label: 'Invercargill',
            address: 'Invercargill, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.444279, 168.257343),
              new LatLng(-46.375031, 168.391047)
            ),
          },
          {
            key: 'Lumsden',
            label: 'Lumsden',
            address: 'Lumsden, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.78631, 168.737594),
              new LatLng(-45.711041, 168.796609)
            ),
          },
          {
            key: 'Otautau',
            label: 'Otautau',
            address: 'Otautau, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.198257, 167.890725),
              new LatLng(-46.120447, 168.004283)
            ),
          },
          {
            key: 'Riverton',
            label: 'Riverton',
            address: 'Riverton, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.395276, 168.007522),
              new LatLng(-46.33044, 168.11133)
            ),
          },
          {
            key: 'StewartIsland',
            label: 'Stewart Island',
            address: 'Stewart Island, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-47.133633, 167.960158),
              new LatLng(-46.85047, 168.290987)
            ),
          },
          {
            key: 'TeAnau',
            label: 'Te Anau',
            address: 'Te Anau, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-45.471069, 167.675193),
              new LatLng(-45.335913, 167.835309)
            ),
          },
          {
            key: 'Tokanui',
            label: 'Tokanui',
            address: 'Tokanui, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.5084, 168.729202),
              new LatLng(-46.474904, 168.768759)
            ),
          },
          {
            key: 'Winton',
            label: 'Winton',
            address: 'Winton, Southland, New Zealand',
            bounds: new LatLngBounds(
              new LatLng(-46.399947, 168.8458),
              new LatLng(-46.315991, 168.949051)
            ),
          },
        ],
      },
    ],
  },
];
