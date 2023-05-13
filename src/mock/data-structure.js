import {
  getRandomArrayElement,
  getRandomNumber,
  getRandomDate,
  getRandomOffersByType,
  createRandomIdFromRangeGenerator,
} from '../utils';
import {
  DESTINATIONS_DESCRIPTIONS,
  PICTURES_DESCRIPTIONS,
  DESTINATIONS_CITIES,
  WAYPOINTS_TYPES,
  OFFERS,
  MIN_ID_NUMBER,
  MAX_ID_NUMBER,
  MIN_COUNT_PICTURES,
  MAX_COUNT_PICTURES,
  MIN_SRC_NUMBER,
  MAX_SRC_NUMBER,
  MIN_BASE_PRICE,
  MAX_BASE_PRICE,
} from '../const';

const idNumber = createRandomIdFromRangeGenerator(MIN_ID_NUMBER, MAX_ID_NUMBER);

const getRandomDestination = () => ({
  id: idNumber().toString(),
  description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
  name: getRandomArrayElement(DESTINATIONS_CITIES),
  pictures: Array.from({length: getRandomNumber(MIN_COUNT_PICTURES, MAX_COUNT_PICTURES)}, () => ({
    src: `https://loremflickr.com/248/152?random=${getRandomNumber(MIN_SRC_NUMBER,MAX_SRC_NUMBER)}`,
    description: getRandomArrayElement(PICTURES_DESCRIPTIONS)
  }))
});


const generateNewWaypoint = () => {
  const type = getRandomArrayElement(WAYPOINTS_TYPES);
  const date = getRandomDate();

  return {
    basePrice: getRandomNumber(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: date.start,
    dateTo: date.end,
    destination: 1,
    isFavorite: Math.random() > 0.5,
    offers: getRandomOffersByType(OFFERS, type.toLowerCase()),
    type
  };
};

const createMockPoints = (count) => Array.from({ length: count }, generateNewWaypoint);
const getRandomDestinations = (count) => Array.from({ length: count }, getRandomDestination);

export { getRandomDestinations, createMockPoints, generateNewWaypoint };
