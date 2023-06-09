import AbstractView from '../framework/view/abstract-view.js';

function createTripFiltersTemplate(type, count, currentFilterType) {
  return (/*html*/
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}>
      <label
        class="trip-filters__filter-label"
        for="filter-${type}">
        ${type}
      </label>
    </div>`
  );
}

const createFilterFormTemplate = (filters, currentFilterType) => (/*html*/`
  <form class="trip-filters" action="#" method="get">
      ${filters.map(({type, count}) =>
    createTripFiltersTemplate(type, count, currentFilterType)).join('')}
  </form>`
);

export default class ListFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterFormTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
