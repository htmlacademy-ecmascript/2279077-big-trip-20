import dayjs from 'dayjs';

function durationPoint(point) {
  return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
}

function sortByTime(points) {
  return points.sort((a, b) => durationPoint(b) - durationPoint(a));
}

function sortByPrice(points) {
  return points.sort((a, b) => b.basePrice - a.basePrice);
}

export {sortByTime, sortByPrice};
