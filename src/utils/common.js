import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const getOffersByType = (offers, offerType) => {
  const offersByType = offers.find((offer) => offer.type === offerType);
  return offersByType ? offersByType.offers : [];
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
  getOffersByType,
  isDateFuture,
  isDatePast,
  isDatePresent,
  getDuration,
  formatDuration
};
