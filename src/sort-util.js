import dayjs from 'dayjs';

const durationPoint = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

const sortByTime = (points) => points.sort((a, b) => durationPoint(b) - durationPoint(a));

const sortByPrice = (points) => points.slice().sort((a, b) => b.basePrice - a.basePrice);

export {sortByTime, sortByPrice};
