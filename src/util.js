import dayjs from 'dayjs';

// Функции для поиска случайного числа из диапазона

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const createRandomIdFromRangeGenerator = (min, max) => {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const getRandomNumber = (min, max) => getRandomInteger(min, max);
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];


//Функция для генерации дополнительных предложений

const getRandomOffersByType = (offers, type) => {
  const index = offers.map((offer) => offer.type).indexOf(type);
  const offersIDs = [];

  if (index !== -1) {
    const offersByType = offers[index].offers;
    if (offersByType) {
      for (let i = 0; i < offersByType.length; i++) {
        offersIDs.push(offersByType[i].id.toString());
      }
      return offersIDs;
    }
  }
  return offersIDs;
};


//Функция для генерации случайных дат

const getRandomDate = () => {
  const minCount = 1;
  const maxCountDays = 15;
  const maxCountHours = 23;
  const maxCountMinutes = 59;

  const startDate = dayjs()
    .add(getRandomNumber(minCount, maxCountDays), 'day')
    .add(getRandomNumber(minCount, maxCountHours), 'hour')
    .add(getRandomNumber(minCount, maxCountMinutes), 'minute');

  const endDate = startDate.clone()
    .add(getRandomInteger(0, maxCountDays), 'day')
    .add(getRandomInteger(0, maxCountHours), 'hour')
    .add(getRandomInteger(0, maxCountMinutes), 'minute');

  return {
    start: startDate.toDate(),
    end: endDate.toDate()
  };
};

const countDuration = (start, end) => {
  const interval = new Date(end - start);

  return {
    days: interval.getUTCDate() - 1,
    hours: interval.getUTCHours(),
    minutes: interval.getUTCMinutes()
  };
};

const constructionDuration = (interval) => {
  const duration = [];
  if (interval.days !== 0) {
    duration[0] = String(interval.days).padStart(2, '0');
    duration[0] += 'D';
  }
  if (interval.hours !== 0) {
    duration[1] = String(interval.hours).padStart(2, '0');
    duration[1] += 'H';
  }
  if (interval.minutes !== 0) {
    duration[2] = String(interval.minutes).padStart(2, '0');
    duration[2] += 'M';
  }

  return duration.join('');
};

export {
  getRandomArrayElement,
  getRandomNumber,
  getRandomDate,
  getRandomOffersByType,
  createRandomIdFromRangeGenerator,
  countDuration,
  constructionDuration
};
