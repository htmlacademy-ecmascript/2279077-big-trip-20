import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createNoPointsTemplate (filterType) {
  const noPointsTextValue = NoPointsTextType[filterType];
  return /*html*/` <p class="trip-events__msg">${noPointsTextValue}</p>`;
}

export default class NoPointView extends AbstractView{
  #currentFilterType = null;

  constructor({filterType}){
    super();
    this.#currentFilterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#currentFilterType);
  }
}
