const MIN_ID_NUMBER = 1;
const MAX_ID_NUMBER = 30;
const MIN_COUNT_PICTURES = 1;
const MAX_COUNT_PICTURES = 10;
const MIN_SRC_NUMBER = 100;
const MAX_SRC_NUMBER = 200;
const MIN_BASE_PRICE = 100;
const MAX_BASE_PRICE = 3000;

const POINTS_COUNT = 5;

const DESTINATIONS_CITIES = ['Amsterdam', 'Alicante', 'Minsk', 'Tashkent', 'Chamonix', 'Geneva', 'Seoul', 'Sihanoukville', 'New York'];

const POINTS_TYPES = ['Check-in', 'Sightseeing', 'Restaurant', 'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight'];

const DESTINATIONS_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'Fusce tristique felis at fermentum pharetra.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
];

const PICTURES_DESCRIPTIONS = [
  'Aliquam erat volutpat.',
  'Cras aliquet varius magna.',
  'Phasellus eros mauris.',
  'Fusce tristique felis.',
  'Nullam nunc ex.'
];

const OFFERS = [
  {
    type: 'check-in',
    offers: [
      {
        id: '1',
        title: 'Add breakfast',
        price: 50
      },
      {
        id: '2',
        title: 'Add breakfast',
        price: 50
      },
      {
        id: '3',
        title: 'Add breakfast',
        price: 50
      },
      {
        id: '4',
        title: 'Add breakfast',
        price: 50
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: '10',
        title: 'Book tickets',
        price: 40
      },
      {
        id: '20',
        title: 'Lunch in city',
        price: 30
      }
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: '100',
        title: 'Brunch',
        price: 20
      },
      {
        id: '200',
        title: 'Takeaway lunch',
        price: 12
      },
      {
        id: '321',
        title: 'Cooking master class',
        price: 30
      }
    ]
  },
  {
    type: 'taxi',
    offers: [
      {
        id: '2341',
        title: 'Order Uber',
        price: 40
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: '1541',
        title: 'airport-hotel route',
        price: 20
      },
      {
        id: '442',
        title: 'City tour',
        price: 10
      }
    ]
  },
  {
    type: 'train',
    offers: []
  },
  {
    type: 'ship',
    offers: []
  },
  {
    type: 'drive',
    offers: [
      {
        id: '71',
        title: 'Rent a car',
        price: 200
      },
      {
        id: '82',
        title: 'Car rental with driver',
        price: 1000
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: '51',
        title: 'Add luggage',
        price: 50
      },
      {
        id: '442',
        title: 'Switch to comfort',
        price: 80
      }
    ]
  }
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  DESTINATIONS_CITIES,
  POINTS_TYPES,
  DESTINATIONS_DESCRIPTIONS,
  PICTURES_DESCRIPTIONS,
  OFFERS,
  MIN_ID_NUMBER,
  MAX_ID_NUMBER,
  MIN_COUNT_PICTURES,
  MAX_COUNT_PICTURES,
  MIN_SRC_NUMBER,
  MAX_SRC_NUMBER,
  MIN_BASE_PRICE,
  MAX_BASE_PRICE,
  POINTS_COUNT,
  FilterType,
  SortType,
  UserAction,
  UpdateType
};
