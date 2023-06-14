import {FilterType} from '../src/const.js';
import {isDateFuture, isDatePast, isDatePresent} from '../src/utils.js';

const dataFilter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isDatePresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isDatePast(point.dateTo)),
};

export {dataFilter};
