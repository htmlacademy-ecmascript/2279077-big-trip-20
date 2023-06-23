import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createListSortTemplate(currentSortType) {
  return (/*html*/
    `<div class="trip-sort__item trip-sort__item--day">
      <input
        id="sort-day"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-day"
        checked
        data-sort-type=${SortType.DAY}
      >
      <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item trip-sort__item--event">
      <input
        id="sort-event"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-event"
        disabled
        data-sort-type=${SortType.EVENT}
      >
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item trip-sort__item--time">
      <input
        id="sort-time"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-time"
        data-sort-type=${SortType.TIME}
        ${currentSortType === SortType.TIME ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item trip-sort__item--price">
      <input
        id="sort-price"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-price"
        data-sort-type=${SortType.PRICE}
        ${currentSortType === SortType.PRICE ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item trip-sort__item--offer">
      <input
        id="sort-offer"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-offer"
        disabled
        data-sort-type=${SortType.OFFERS}
      >
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>`
  );
}

function createSortFormTemplate(currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${createListSortTemplate(currentSortType)}
    </form>`
  );
}
export default class ListSortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortFormTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
