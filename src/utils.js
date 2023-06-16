import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// Функции для поиска случайного числа из диапазона

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomNumber = (min, max) => getRandomInteger(min, max);
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

// Функция для генерации предложений

const getOffersByType = (offers, offerType) => {
  const offersByType = offers.find((offer) => offer.type === offerType);
  return offersByType ? offersByType.offers : [];
};

//Функция для генерации дополнительных предложений

const getRandomOffersByType = (offers, type) => {
  const offersByType = getOffersByType(offers, type);
  const offersIDs = [];

  if (offersByType.length > 0) {
    offersByType.forEach((offer) => {
      if (Math.random() > 0.5) {
        offersIDs.push(offer.id);
      }
    });
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


const DateFormat = {
  EVENT_DATE: 'MMM D',
  SHORT_EVENT_DATE: 'D',
  EVENT_EDIT_DATE: 'DD/MM/YY HH:mm',
  TIME: 'HH:mm',
  D_H_M_DURATION: 'DD[D] HH[H] mm[M]',
  H_M_DURATION: 'HH[H] mm[M]',
  M_DURATION: 'mm[M]'
};

const getDuration = (start, end) => dayjs.duration(dayjs(end).diff(dayjs(start)));

const formatDuration = (durationValue) => {
  if (durationValue.get('day')) {
    return durationValue.format(DateFormat.D_H_M_DURATION);
  }

  if (!durationValue.get('day') && durationValue.get('hour')) {
    return durationValue.format(DateFormat.H_M_DURATION);
  }

  return durationValue.format(DateFormat.M_DURATION);
};

const isDateFuture = (dateFrom) => dayjs().isBefore(dateFrom);

const isDatePast = (dateTo) => dayjs().isAfter(dateTo);

const isDatePresent = (dateFrom, dateTo) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo);


export {
  getRandomArrayElement,
  getRandomNumber,
  getRandomDate,
  getRandomOffersByType,
  getOffersByType,
  isDateFuture,
  isDatePast,
  isDatePresent,
  getDuration,
  formatDuration
};
