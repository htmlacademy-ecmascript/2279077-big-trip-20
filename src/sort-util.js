import dayjs from 'dayjs';

const getDateDiff = (dateOne, dateTwo) => dayjs(dateOne).unix() - dayjs(dateTwo).unix();

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const getDurationPoint = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

const sortByDate = ((a, b) => getDateDiff(a.dateFrom, b.dateFrom));

const sortByTime = ((a, b) => getDurationPoint(b) - getDurationPoint(a));

const sortByPrice = (a, b) => b.basePrice - a.basePrice;

export {sortByDate, sortByTime, sortByPrice, isDatesEqual};
