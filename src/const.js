import dayjs from 'dayjs';

const AUTHORIZATION = 'Basic jjjf456633kflv;vkdj';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const POINTS_TYPES = ['Check-in', 'Sightseeing', 'Restaurant', 'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight'];

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: dayjs().toISOString(),
  dateTo: dayjs().add(2, 'D').toISOString(),
  isFavorite: false,
  offers: [],
  type: POINTS_TYPES[0].toLowerCase()
};

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
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export {
  AUTHORIZATION,
  END_POINT,
  POINTS_TYPES,
  BLANK_POINT,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  Mode
};
