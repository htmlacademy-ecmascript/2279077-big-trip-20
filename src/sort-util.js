import dayjs from 'dayjs';

const getDateDiff = (dateOne, dateTwo) => dayjs(dateOne).unix() - dayjs(dateTwo).unix();

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const durationPoint = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

const sortByDate = (points) => points.sort((a, b) => getDateDiff(a.dateFrom, b.dateFrom));

const sortByTime = (points) => points.sort((a, b) => durationPoint(b) - durationPoint(a));

const sortByPrice = (points) => points.slice().sort((a, b) => b.basePrice - a.basePrice);

export {sortByDate, sortByTime, sortByPrice, isDatesEqual};
